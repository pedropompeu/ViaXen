import * as duckdb from '@duckdb/duckdb-wasm';
import duckdb_wasm from '@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url';
import mvp_worker from '@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url';
import duckdb_wasm_eh from '@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url';
import eh_worker from '@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?url';

// Valores baseados na Resolução ANTT 5820/2019 e atualizações.
// Atualizar trimestralmente a partir de: dados.gov.br (busca: "piso mínimo frete ANTT")
const ANTT_CSV_PATH = '/data/antt_frete.csv';

const MANUAL_BUNDLES: duckdb.DuckDBBundles = {
    mvp: { mainModule: duckdb_wasm, mainWorker: mvp_worker },
    eh:  { mainModule: duckdb_wasm_eh, mainWorker: eh_worker },
};

let db: duckdb.AsyncDuckDB | null = null;
let conn: duckdb.AsyncDuckDBConnection | null = null;

export async function initDuckDB() {
    if (db) return { db, conn };

    const bundle = await duckdb.selectBundle(MANUAL_BUNDLES);
    const worker = new Worker(bundle.mainWorker!);
    const logger = new duckdb.ConsoleLogger();
    db = new duckdb.AsyncDuckDB(logger, worker);
    await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
    conn = await db.connect();

    const response = await fetch(ANTT_CSV_PATH);
    if (!response.ok) throw new Error(`Falha ao carregar tabela ANTT: ${response.status}`);
    const buffer = await response.arrayBuffer();
    await db.registerFileBuffer('antt_frete.csv', new Uint8Array(buffer));

    await conn.query(`
        CREATE TABLE antt_frete AS
        SELECT * FROM read_csv_auto('antt_frete.csv',
            header = true,
            sep = ',',
            columns = {
                'tipo_carga':     'VARCHAR',
                'eixos':          'INTEGER',
                'custo_fixo':     'DOUBLE',
                'custo_variavel': 'DOUBLE'
            }
        )
    `);

    return { db, conn };
}

const EIXOS_VALIDOS = new Set([2, 3, 4, 5, 6, 7, 8, 9]);

export async function calculateFreight(distanciaKm: number, eixos: number) {
    if (!EIXOS_VALIDOS.has(eixos)) throw new Error(`Número de eixos inválido: ${eixos}`);
    const dist = Math.max(0, Number(distanciaKm));
    if (!isFinite(dist)) throw new Error('Distância inválida');

    if (!conn) await initDuckDB();
    const stmt = await conn!.prepare(
        `SELECT tipo_carga, (custo_fixo + (custo_variavel * ?)) AS frete_minimo
         FROM antt_frete WHERE eixos = ?`
    );
    const result = await stmt.query(dist, eixos);
    await stmt.close();
    return result.toArray().map(row => row.toJSON());
}

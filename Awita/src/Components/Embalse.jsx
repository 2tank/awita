import './Embalse.css';

function Embalse({ nombre, ambito, aguaTotal, generaElectricidad }) {
    return (
        <section className="embalse">
            <article className='embalseTexto'>
                <h1>{`Nombre del Embalse: ${nombre}`}</h1>
                <h2>{`Ámbito: ${ambito}`}</h2>
            </article>
            <article className='embalseTextoSecundario'>
                <h1>{`${aguaTotal} m³`}</h1>
                <h1 id={generaElectricidad ? 'electricidad' : 'noElectricidad'}>
                    {generaElectricidad ? 'Electricidad' : 'No Electricidad'}
                </h1>
            </article>
        </section>
    );
}

export default Embalse;

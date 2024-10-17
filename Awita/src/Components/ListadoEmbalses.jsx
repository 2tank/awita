import { useEffect, useState } from "react";
import Embalse from './Embalse';
import './Embalse.css';
import NavBar from "./NavBar";

function ListadoEmbalses() {
    const [embalses, setEmbalses] = useState([]); // Estado para almacenar los embalses
    const [offset, setOffset] = useState(0); // Estado para controlar el offset de la petición
    const [filterNombre, setFilterNombre] = useState(''); // Filtro por nombre del embalse
    const [filterAmbito, setFilterAmbito] = useState(''); // Filtro por nombre del ámbito
    const [filterElectricidad, setFilterElectricidad] = useState(false); // Filtro por electricidad
    const [error, setError] = useState(); // Estado para manejar errores
    const [isFiltered, setIsFiltered] = useState(false); // Estado para manejar si hay un filtro aplicado

    // Función para fetch de embalses
    const fetchEmbalses = async () => {
        try {
            const response = await fetch(`https://g6f757b5f511ccb-retomalakathon.adb.eu-madrid-1.oraclecloudapps.com/ords/test/embalsesutf8sinarticulosnico/?limit=5&offset=${offset}`);
            if (!response.ok) {
                throw new Error('Error en la respuesta de la API');
            }
            const data = await response.json(); // Convertimos la respuesta a JSON
            setEmbalses(prevEmbalses => [...prevEmbalses, ...data.items || []]); // Agregamos los nuevos embalses al estado
        } catch (error) {
            setError(error.message); // Guardamos el mensaje de error en el estado
        }
    };

    // Fetch de embalses cuando cambia el offset o cuando hay un filtro aplicado
    useEffect(() => {
        if (!isFiltered) {
            fetchEmbalses(); // Llamamos a la función para hacer la petición solo si no hay filtros aplicados
        }
    }, [offset, isFiltered]); // Ejecutamos cuando el offset o isFiltered cambie

    // Función para filtrar embalses
    const fetchFilteredEmbalses = async (filters) => {
        let query = {
            "embalse_nombre": filters.nombre || undefined,
            "ambito_nombre": filters.ambito || undefined,
            "electrico_flag": filters.electricidad ? "1" : "0" // Enviamos "1" si el checkbox está marcado, de lo contrario "0"
        };

        // Eliminar propiedades vacías de la consulta
        const filteredQuery = Object.fromEntries(Object.entries(query).filter(([_, v]) => v != null));

        // Agrega un console.log para verificar el query
        console.log("Consulta filtrada:", JSON.stringify(filteredQuery));

        try {
            const response = await fetch(`https://g6f757b5f511ccb-retomalakathon.adb.eu-madrid-1.oraclecloudapps.com/ords/test/embalsesutf8sinarticulosnico/?q=${JSON.stringify(filteredQuery)}`);
            
            // Agregar console.log para verificar la respuesta
            console.log("Respuesta de la API:", response);

            if (!response.ok) {
                throw new Error('Error en la respuesta de la API');
            }
            const data = await response.json(); // Convertimos la respuesta a JSON
            setEmbalses(data.items || []); // Almacenamos los embalses filtrados en el estado
            setOffset(0); // Reiniciamos el offset para la nueva búsqueda
        } catch (error) {
            setError(error.message); // Guardamos el mensaje de error en el estado
            console.error("Error en fetchFilteredEmbalses:", error); // Log para depuración
        }
    };

    // Función para manejar el filtrado
    const handleFilter = () => {
        const filters = {
            nombre: filterNombre,
            ambito: filterAmbito,
            electricidad: filterElectricidad,
        };

        if (!filters.nombre && !filters.ambito && !filters.electricidad) {
            // Si no hay filtros, no aplicamos filtrado y reiniciamos
            setOffset(0);
            setEmbalses([]); // Reiniciamos los embalses para que no se dupliquen
            setIsFiltered(false); // No hay filtros aplicados
            fetchEmbalses(); // Llamamos a la función para cargar más embalses
        } else {
            setIsFiltered(true); // Se aplica un filtro
            fetchFilteredEmbalses(filters); // Llamamos a la función para obtener embalses filtrados
        }
    };

    const handleLoadMore = () => {
        if (isFiltered) {
            // Si hay filtros aplicados, no se necesita modificar el offset
            fetchFilteredEmbalses({ 
                nombre: filterNombre,
                ambito: filterAmbito,
                electricidad: filterElectricidad,
            });
        } else {
            // Si no hay filtros aplicados, simplemente aumentamos el offset
            setOffset(prevOffset => prevOffset + 5); // Aumentamos el offset para cargar más embalses
        }
    };

    return (
        <>
            <NavBar></NavBar>
            
            <div className="filterContainer">
                <input 
                    type="text" 
                    placeholder="Filtrar por nombre del embalse" 
                    value={filterNombre} 
                    onChange={(e) => setFilterNombre(e.target.value)} 
                />
                <input 
                    type="text" 
                    placeholder="Filtrar por ámbito" 
                    value={filterAmbito} 
                    onChange={(e) => setFilterAmbito(e.target.value)} 
                />
                <div className="checkboxContainer">
                    <label>
                        <input 
                            type="checkbox" 
                            checked={filterElectricidad} 
                            onChange={(e) => setFilterElectricidad(e.target.checked)} 
                        />
                        Genera electricidad
                    </label>
                </div>
                <button onClick={handleFilter}>Filtrar</button>
            </div>
            {error && <p className="error">{error}</p>}
            <section className="listadoEmbalses">
                {embalses.map((embalse) => (
                    <div className="embalseDiv" key={embalse.id}>
                        <Embalse
                            nombre={embalse.embalse_nombre}
                            ambito={embalse.ambito_nombre}
                            aguaTotal={embalse.agua_total}
                            generaElectricidad={embalse.electrico_flag}
                        />
                    </div>
                ))}
            </section>
            <button className="button" onClick={handleLoadMore}>
                Cargar más embalses
            </button>
        </>
    );
}

export default ListadoEmbalses;

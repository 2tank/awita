const haversineDistance = (user_x, user_y, pant_x, pant_y) => {
    const toRadians = (degree) => (degree * Math.PI) / 180;
  
    const lat1 = toRadians(user_x);
    const lon1 = toRadians(user_y);
    const lat2 = toRadians(pant_x);
    const lon2 = toRadians(pant_y);
  
    const deltaLat = lat2 - lat1;
    const deltaLon = lon2 - lon1;
  
    const a = Math.sin(deltaLat / 2) ** 2 +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(deltaLon / 2) ** 2;
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    const R = 6371; // Radio de la Tierra en kilómetros
    const distance = R * c;
  
    return distance; // Devuelve la distancia en kilómetros
};

const dataFiltering = (data, refX, refY, radius) => {
    // Convertimos el JSON a un array, asegurándonos de que sea un array
    const dataArray = Array.isArray(data) ? data : Object.values(data);

    return dataArray.filter(item => {
        // Calculamos la distancia del punto respecto a un punto de referencia (refX, refY)
        let distancia = haversineDistance(refX, refY, item.x, item.y);
        console.log(distancia);
      
        // Si la distancia es mayor que un umbral, eliminamos el elemento
        return distancia <= radius/1000;
    });
}

async function consultarApiOracle(x, y) {
    try {
        // Primer fetch: datos de posición
        let responsePosicion = await fetch(`https://g6f757b5f511ccb-retomalakathon.adb.eu-madrid-1.oraclecloudapps.com/ords/test/listadonum/?q={"X":"${x}","Y":"${y}"}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
  
        if (!responsePosicion.ok) {
            throw new Error('Error en la consulta de Posicion: ' + responsePosicion.status);
        }
        let dataPosicion = await responsePosicion.json();
  
        // Segundo fetch: datos del embalse basados en el nombre obtenido de la posición
        let responseEmbalse = await fetch(`https://g6f757b5f511ccb-retomalakathon.adb.eu-madrid-1.oraclecloudapps.com/ords/test/embalsesutf8sinarticulosnico/?q={"embalse_nombre":"${dataPosicion.nombre}"}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
  
        if (!responseEmbalse.ok) {
            throw new Error('Error en la consulta de Embalse: ' + responseEmbalse.status);
        }
        let dataEmbalse = await responseEmbalse.json();
  
        // Tercer fetch: datos del agua basado en el ID del embalse
        let responseAgua = await fetch(`https://g6f757b5f511ccb-retomalakathon.adb.eu-madrid-1.oraclecloudapps.com/ords/test/agua/?q={"id":{"$eq":${dataEmbalse.id}}}&order=fecha:desc&limit=1`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
  
        if (!responseAgua.ok) {
            throw new Error('Error en la consulta de Agua: ' + responseAgua.status);
        }
        let dataAgua = await responseAgua.json();
  
        // Combinamos los tres resultados en un solo objeto y lo retornamos
        let dataCombinada = Object.assign({}, dataPosicion, dataEmbalse, dataAgua);
  
        return dataCombinada;
  
    } catch (error) {
        console.error('Hubo un error al hacer la consulta a la API:', error);
        return null;
    }
  }
  
  // Función para iterar por los elementos y actualizar el JSON
  async function actualizarJsonConApi(data) {
    for (let item of data) {
        // Hacemos la consulta para cada item usando los valores x e y
        let nuevosParametros = await consultarApiOracle(item.x, item.y);
  
        // Si la consulta es exitosa, agregamos los nuevos parámetros al objeto
        if (nuevosParametros) {
            Object.assign(item, nuevosParametros); // Mezclamos las nuevas propiedades con las existentes
        }
    }
  
    // Retornamos el JSON actualizado
    return data;
  }

  async function encontrarCercanos(user_x,user_y) {
    try {
      // Primer fetch: datos de posición
      let responsePosicion = await fetch(`https://g6f757b5f511ccb-retomalakathon.adb.eu-madrid-1.oraclecloudapps.com/ords/test/listadonum/?q={
  "$and": [
    {
      "$and": [
        {"X": {"$lt": ${user_x + 2}}},
        {"X": {"$gt": ${user_x - 2}}}
      ]
    },
    {
      "$and": [
        {"Y": {"$lt": ${user_y + 1}}},
        {"Y": {"$gt": ${user_y - 1}}}
      ]
    }
  ]
}
`, {
          headers: {
              'Content-Type': 'application/json'
          }
      });
  
      if (!responsePosicion.ok) {
          throw new Error('Error en la consulta de Posicion: ' + responsePosicion.status);
      }
      let data = await responsePosicion.json();

      return data;
  
  } catch (error) {
      console.error('Hubo un error al hacer la consulta a la API:', error);
      return null;
  }
  }
  
export { haversineDistance, dataFiltering, consultarApiOracle, actualizarJsonConApi, encontrarCercanos};
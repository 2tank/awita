import io.restassured.RestAssured;
import org.junit.Test;
import io.restassured.response.Response;
import org.junit.jupiter.api.DisplayName;

import java.util.List;

import static org.junit.Assert.*;


public class ApiServiceTest {
    String urlEmbalses = "https://g6f757b5f511ccb-retomalakathon.adb.eu-madrid-1.oraclecloudapps.com/ords/test/embalsesutf8sinarticulosnico/";
    String urlAgua = "https://g6f757b5f511ccb-retomalakathon.adb.eu-madrid-1.oraclecloudapps.com/ords/test/agua/";
    String urlListaEmbalses= "https://g6f757b5f511ccb-retomalakathon.adb.eu-madrid-1.oraclecloudapps.com/ords/test/listadonum/";

    @Test
    @DisplayName("Hacer una peticion a la api, de la tabla agua, con una query usando id devuelve el embalse correctamente")
    public void getEmbalse_QueryId_DevuelveEmbalseConMismoId(){
        //Arrange
        String query = "{\"id\":{\"$eq\":3}}";
        String valorEsperado = "FERNANDINA";

        //Act
        Response response = RestAssured
                .given()
                .param("q", query)
                .when()
                .get(urlEmbalses);

        String valorObtenido = response.jsonPath().getString("items[0].embalse_nombre");

        //Assert
        assertEquals(valorEsperado, valorObtenido);

    }

    @Test
    @DisplayName("Hacer una peticion a la api de la tabla agua, devuelve todos los embalses")
    public void getEmbalse_DevuelveTodosLosEmbalses() {
        //Arrange
        int tamanyoEsperado = 25;

        //Act
        Response response = RestAssured
                .given()
                .when()
                .get(urlEmbalses);

        int tamanyoObtenido = response.jsonPath().getList("items").size();

        //Assert
        assertEquals(tamanyoEsperado, tamanyoObtenido);
    }


    @Test
    @DisplayName("Hacer una peticion a la api de la tabla embalse, con una query usando el nombre, devuelve el listado de embalses correctamente")
    public void getEmbalses_QueryNombre_DevuelveEmbalsesCorrectamente() {
        //Arrange
        String query = "{\"embalse_nombre\":\"FERNANDINA\"}";
        String nombreEsperado = "FERNANDINA";

        //Act
        Response response = RestAssured
                .given()
                .param("q", query)
                .when()
                .get(urlEmbalses);

        List<String> nombresObtenidos = response.jsonPath().getList("items.embalse_nombre");

        //Assert
        assertTrue(nombresObtenidos.contains(nombreEsperado));
    }

    @Test
    @DisplayName("Hacer una peticion a la api de la tabla agua, devuelve todos las aguas")
    public void getAgua_DevuelveTodasLasAguas() {
        //Arrange
        int tamanyoEsperado = 25;

        //Act
        Response response = RestAssured
                .given()
                .when()
                .get(urlAgua);

        int tamanyoObtenido = response.jsonPath().getList("items").size();

        //Assert
        assertEquals(tamanyoEsperado, tamanyoObtenido);
    }

    @Test
    @DisplayName("Hacer una peticion a la api, de la tabla agua, con una query usando id devuelve el embalse correctamente")
    public void getAgua_QueryId_DevuelveListaDeAguaCorrectamente() {
        //Arrange
        String query = "{\"id\":{\"$eq\":18}}";
        int tamanyoEsperado = 25;

        //Act
        Response response = RestAssured
                .given()
                .param("q", query)
                .when()
                .get(urlAgua);

        int tamanyoObtenido = response.jsonPath().getList("items").size();

        //Assert
        assertEquals(tamanyoEsperado, tamanyoObtenido);

    }

    @Test
    @DisplayName("Hacer una peticion a la api de la tabla agua, con una query usando id devuelve el embalse correctamente")
    public void getAgua_QueryId_ContieneAguaActualCorrecta() {
        //Arrange
        String query = "{\"id\":{\"$eq\":18}}";
        String valorEsperado = "56";

        //Act
        Response response = RestAssured
                .given()
                .param("q", query)
                .when()
                .get(urlAgua);

        String valorObtenido = response.jsonPath().getString("items[0].agua_actual");;

        //Assert
        assertEquals(valorEsperado, valorObtenido);

    }

    @Test
    @DisplayName("Hacer una peticion a la api del listado de embalses usando coordenadas, devuelve el embalse correctamente")
    public void getListaEmbalse_XY_DevuelveEmbalseCorrespondiente(){
        //Arrange
        String query = "{\"X\":\"0.991459934\",\"Y\":\"42.50037097\"}";

        String codigoEsperado = "9250031";

        //Act
        Response response = RestAssured
                .given()
                .param("q", query)
                .when()
                .get(urlListaEmbalses);

        String codigoObtenido = response.jsonPath().getString("items[0].codigo");

        //Assert
        assertEquals(codigoEsperado, codigoObtenido);
    }



}

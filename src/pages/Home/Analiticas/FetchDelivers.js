import { message } from "antd";
import axios from "axios";

async function fetchAllDeliveriesClients() {
    try {
        const response = await axios.get("http://localhost:4000/getDeliveries")
        if (response.status === 200) {
            return response.data
        }else{
            message.error("Hubo un error al traer todas las entregas de la base de datos")
            return;
        }
    } catch (error) {
        if (error.response) {
            message.error("Hubo un error al traer todas las entregas de la base de datos")
        }else{
            message.error("Error de red, no se pudieron traer las entregas de la base de datos")

        }
    }
}

export default fetchAllDeliveriesClients
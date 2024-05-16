import { API_URL } from "@/config/server";
import { transformToDate } from "@/utils/date";

export interface ICustomer {
  _id?: string,
  name: string,
  nacionality: string
  date: Date,
  gender: string,
}

export const HistoryService = {
  async get() {
    try {
      const response = await fetch(`${API_URL}/history`, {
        method: "GET"
      });
      const data = await response.json()
      return data.map((d: any) => ({ 
        ...d,
        createdAt: transformToDate(d.createdAt),
        current: d?.current?.map((c: any) => ({...c, date: transformToDate(c.date)})),
        previous: d?.previous?.map((c: any) => ({...c, date: transformToDate(c.date)}))
      }))
    } catch (error) {
      return { error: 'Não foi possível buscar clientes. Tente novamente mais tarde' }
    }
  },
}
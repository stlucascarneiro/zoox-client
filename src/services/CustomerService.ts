import { API_URL } from "@/config/server";
import { transformToDate } from "@/utils/date";

export interface ICustomer {
  _id?: string,
  name: string,
  nacionality: string
  date: Date,
  gender: string,
}

export const CustomerService = {
  async get() {
    try {
      const response = await fetch(`${API_URL}/customer`, {
        method: "GET"
      });
      const data = await response.json()
      return data.map((d: any) => ({ ...d, date: transformToDate(d.date) }))
    } catch (error) {
      return { error: 'Não foi possível buscar clientes. Tente novamente mais tarde' }
    }
  },

  async uploadFile(file: any) {
    try {
      const formData = new FormData()
      formData.append('file', file)
  
      const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData
      });
  
      const data = await response.json()
      return data.map((d: any) => ({ ...d, date: transformToDate(d.date) }))
    } catch (error) {
      return { error: 'Não foi possível enviar arquivo. Tente novamente mais tarde' }
    }
  },

  async create(customer: ICustomer) {
    try {
      const response = await fetch(`${API_URL}/customer`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(customer)
      })
      return response
    } catch (error) {
      return { error: 'Não foi possível criar cliente. Tente novamente mais tarde' }
    }
  },

  async edit(customer: ICustomer) {
    try {
      const response = await fetch(`${API_URL}/customer`, {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(customer)
      })
      return response
    } catch (error) {
      return { error: 'Não foi possível editar cliente. Tente novamente mais tarde' }
    }
  },

  async delete(customer: ICustomer[]) {
    try {
      const ids = customer.map(c => c._id)
      const response = await fetch(`${API_URL}/customer`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(ids)
      })
      return response
    } catch (error) {
      return { error: 'Não foi possível excluir clientes. Tente novamente mais tarde' }
    }
  }
}
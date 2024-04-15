// Importando a instância do axios configurada
import { api } from 'boot/axios'

// Função que retorna um conjunto de métodos para interagir com a API
export default function useApi (url) {
  // Método para listar todos os itens de um recurso
  const list = async () => {
    try {
      const { data } = await api.get(url)
      return data
    } catch (error) {
      throw new Error(error)
    }
  }

  // Método para obter um item específico de um recurso pelo ID
  const getById = async (id) => {
    try {
      const { data } = await api.get(`${url}/${id}`)
      return data
    } catch (error) {
      throw new Error(error)
    }
  }

  // Método para obter itens de um recurso pelo CPF
  const getBycpf = async (cpf) => {
    try {
      const { data } = await api.get(url, {
        params: { cpf }
      })
      return data
    } catch (error) {
      throw new Error(error)
    }
  }

  // Método para obter itens de um recurso pelo código do concurso
  const getBycodigoConcurso = async (codigoConcurso) => {
    try {
      const { data } = await api.get(url, {
        params: { codigoConcurso }
      })
      return data
    } catch (error) {
      throw new Error(error)
    }
  }

  // Método para criar um novo item em um recurso
  const post = async (form) => {
    try {
      const { data } = await api.post(url, form)
      return data
    } catch (error) {
      throw new Error(error)
    }
  }

  // Método para atualizar um item existente em um recurso
  const update = async (form) => {
    try {
      const { data } = await api.put(`${url}/${form.id}`, form)
      return data
    } catch (error) {
      throw new Error(error)
    }
  }

  // Método para remover um item de um recurso
  const remove = async (id) => {
    try {
      const { data } = await api.delete(`${url}/${id}`)
      return data
    } catch (error) {
      throw new Error(error)
    }
  }

  // Retornando todos os métodos
  return {
    list,
    post,
    update,
    remove,
    getById,
    getBycpf,
    getBycodigoConcurso
  }
}

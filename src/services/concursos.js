import useApi from 'src/composables/UseApi'

export default function concursosService () {
  const { list, post, update, remove, getById, getBycodigoConcurso } = useApi('concursos')

  return {
    list,
    post,
    update,
    remove,
    getById,
    getBycodigoConcurso
  }
}

import useApi from 'src/composables/UseApi'

export default function candidatosService () {
  const { list, post, update, remove, getById, getBycpf } = useApi('candidatos')

  return {
    list,
    post,
    update,
    remove,
    getById,
    getBycpf
  }
}

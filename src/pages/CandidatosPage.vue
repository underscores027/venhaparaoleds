<template>
  <!-- Página principal com padding e espaçamento vertical -->
  <q-page padding class="q-gutter-y-lg">
    <div class="column">
      <!-- Campo de pesquisa com botão de pesquisa -->
      <q-input class="col self-end" outlined v-model="search" type="search" label="search" style="max-width: 300px">
        <template v-slot:append>
          <q-btn flat round color="primary" icon="search" @click="onSearch"/>
        </template>
      </q-input>
    </div>
    <!-- Tabela de candidatos -->
    <q-table
      title="Treats"
      :rows="candidatos"
      :columns="columns"
      row-key="name"
    >
      <template v-slot:top>
        <!-- Cabeçalho da tabela -->
        <span class="text-h5">candidatos</span>
        <q-space />
        <!-- Botão para adicionar novo candidato -->
        <q-btn color="primary" :disable="loading" label="Novo" :to="{ name: 'formCandidatos' }" />
      </template>
      <template v-slot:body-cell-actions="props">
        <!-- Coluna de ações com botões de editar e excluir -->
        <q-td :props="props" class="q-gutter-sm">
          <q-btn icon="edit" color="info" dense @click="handleEditPost(props.row.id)"/>
          <q-btn icon="delete" color="negative" dense @click="handleDeletePost(props.row.id)"/>
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import candidatosService from 'src/services/candidatos'
import concursosService from 'src/services/concursos'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'PaginaCandidatos',
  setup () {
    // Inicialização de variáveis e serviços
    const search = ref('')
    const router = useRouter()
    const $q = useQuasar()
    const candidatos = ref([])
    const { list, remove } = candidatosService()
    const concurso = concursosService()
    const columns = [
      { name: 'id', field: 'id', label: 'Id', sortable: true, align: 'left' },
      { name: 'name', field: 'name', label: 'Nome', sortable: true, align: 'left' },
      { name: 'dataNascimento', field: 'dataNascimento', label: 'Data de Nascimento', sortable: true, align: 'left' },
      { name: 'cpf', field: 'cpf', label: 'CPF', sortable: true, align: 'left' },
      { name: 'actions', field: 'actions', label: 'Ações', sortable: true, align: 'right' }
    ]

    // Busca inicial de candidatos quando a página é carregada
    onMounted(() => {
      getCandidatos()
    })

    // Filtra candidatos por concurso
    const filterprofissoesByconcursos = async (codigoconcurso) => {
      const candidato = await list()
      return candidato.filter(candidato =>
        candidato.profissoes.some(profissao => codigoconcurso.includes(profissao))
      )
    }

    // Realiza a busca de candidatos por concurso
    const onSearch = async () => {
      if (search.value !== '') {
        const [codigoconcurso] = await concurso.getBycodigoConcurso(search.value)
        if (codigoconcurso) {
          const candidatosFiltrados = await filterprofissoesByconcursos(codigoconcurso.vagas)
          console.log(candidatosFiltrados)
          candidatos.value = candidatosFiltrados
        } else {
          $q.notify({ message: 'concurso não encontrado', icon: 'times', color: 'negative' })
        }
      } else {
        await getCandidatos()
        $q.notify({ message: 'insira algum concurso', icon: 'times', color: 'negative' })
      }
    }

    // Busca todos os candidatos
    const getCandidatos = async () => {
      try {
        const data = await list()
        candidatos.value = data
      } catch (error) {
        console.error(error)
      }
    }

    // Deleta um candidato e atualiza a lista de candidatos
    const handleDeletePost = async (id) => {
      try {
        $q.dialog({
          title: 'Deletar',
          message: 'Deseja deletar este candidato ?',
          cancel: true,
          persistent: true
        }).onOk(async () => {
          await remove(id)
          $q.notify({ message: 'Candidato removido', icon: 'check', color: 'positive' })
          await getCandidatos()
        })
      } catch (error) {
        $q.notify({ message: 'Erro ao apagar candidato', icon: 'times', color: 'negative' })
      }
    }

    // Redireciona para a página de edição de candidato
    const handleEditPost = async (id) => {
      router.push({ name: 'formCandidatos', params: { id } })
    }

    return {
      candidatos,
      columns,
      handleDeletePost,
      handleEditPost,
      onSearch,
      search
    }
  }
})
</script>

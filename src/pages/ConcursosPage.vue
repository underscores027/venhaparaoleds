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
    <!-- Tabela de concursos -->
    <q-table
      title="Treats"
      :rows="concursos"
      :columns="columns"
      row-key="name"
    >
      <template v-slot:top>
        <!-- Cabeçalho da tabela -->
        <span class="text-h5">concursos</span>
        <q-space />
        <!-- Botão para adicionar novo concurso -->
        <q-btn color="primary" :disable="loading" label="Novo" :to="{ name: 'formConcursos' }" />
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
  name: 'PaginaConcursos',
  setup () {
    // Inicialização de variáveis e serviços
    const search = ref('')
    const router = useRouter()
    const $q = useQuasar()
    const concursos = ref([])
    const { list, remove } = concursosService()
    const candidato = candidatosService()
    const columns = [
      { name: 'id', field: 'id', label: 'Id', sortable: true, align: 'left' },
      { name: 'orgao', field: 'orgao', label: 'Orgão', sortable: true, align: 'left' },
      { name: 'edital', field: 'edital', label: 'Edital', sortable: true, align: 'left' },
      { name: 'codigoConcurso', field: 'codigoConcurso', label: 'codigo do concurso', sortable: true, align: 'left' },
      { name: 'actions', field: 'actions', label: 'Ações', sortable: true, align: 'right' }
    ]

    // Busca inicial de concursos quando a página é carregada
    onMounted(() => {
      getConcursos()
    })

    // Filtra concursos por profissões
    const filterConcursosByProfissoes = async (profissoes) => {
      const concursos = await list()
      return concursos.filter(concurso =>
        concurso.vagas.some(vaga => profissoes.includes(vaga))
      )
    }

    // Realiza a busca de concursos por profissões
    const onSearch = async () => {
      if (search.value !== '') {
        const [cpf] = await candidato.getBycpf(search.value)
        if (cpf) {
          const concursosFiltrados = await filterConcursosByProfissoes(cpf.profissoes)
          console.log(concursosFiltrados)
          concursos.value = concursosFiltrados
        } else {
          $q.notify({ message: 'candidato não encontrado', icon: 'times', color: 'negative' })
        }
      } else {
        await getConcursos()
        $q.notify({ message: 'insira algum candidato', icon: 'times', color: 'negative' })
      }
    }

    // Busca todos os concursos
    const getConcursos = async () => {
      try {
        const data = await list()
        concursos.value = data
      } catch (error) {
        console.error(error)
      }
    }

    // Deleta um concurso e atualiza a lista de concursos
    const handleDeletePost = async (id) => {
      try {
        $q.dialog({
          title: 'Deletar',
          message: 'Deseja deletar este concurso ?',
          cancel: true,
          persistent: true
        }).onOk(async () => {
          await remove(id)
          $q.notify({ message: 'Concurso removido', icon: 'check', color: 'positive' })
          await getConcursos()
        })
      } catch (error) {
        $q.notify({ message: 'Erro ao apagar concurso', icon: 'times', color: 'negative' })
      }
    }

    // Redireciona para a página de edição de concurso
    const handleEditPost = async (id) => {
      router.push({ name: 'formConcursos', params: { id } })
    }

    return {
      concursos,
      columns,
      handleDeletePost,
      handleEditPost,
      onSearch,
      search
    }
  }
})
</script>

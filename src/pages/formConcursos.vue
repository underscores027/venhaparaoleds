<template>
  <!-- Página principal com padding -->
  <q-page padding>
    <!-- Formulário para adicionar/editar concursos -->
    <q-form
      @submit="onSubmit"
      class="row q-col-gutter-sm"
    >
      <!-- Campo de entrada para o órgão do concurso -->
      <q-input
        outlined
        v-model="form.orgao"
        label="Orgão"
        lazy-rules
        class="col-12"
        :rules="[ val => val && val.length > 0 || 'Campo obrigatório']"
      />

      <!-- Campo de entrada para o edital do concurso -->
      <q-input
        outlined
        v-model="form.edital"
        label="Edital"
        lazy-rules
        class="col-12"
        :rules="[ val => val && val.length > 0 || 'Campo obrigatório']"
      />

      <!-- Campo de entrada para o código do concurso -->
      <q-input
        outlined
        v-model="form.codigoConcurso"
        label="Codigo do concurso"
        lazy-rules
        class="col-12"
        :rules="[ val => val && val.length > 0 || 'Campo obrigatório']"
      />

      <!-- Botões de salvar e cancelar -->
      <div class="col-12 q-gutter-sm">
        <q-btn
          label="Salvar"
          color="primary"
          class="float-right"
          icon="save"
          type="submit"
        />
        <q-btn
          label="Cancelar"
          color="white"
          class="float-right"
          text-color="primary"
          :to="{ name: 'concursos' }"
        />
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import concursosService from 'src/services/concursos'
import { useQuasar } from 'quasar'
import { useRouter, useRoute } from 'vue-router'

export default defineComponent({
  name: 'FormConcursos',
  setup () {
    // Inicialização de variáveis e serviços
    const router = useRouter()
    const route = useRoute()
    const $q = useQuasar()
    const { post, getById, update } = concursosService()
    const form = ref({
      orgao: '',
      edital: '',
      codigoConcurso: ''
    })

    // Se um ID de concurso for fornecido na URL, preenche o formulário com os dados do concurso
    onMounted(async () => {
      if (route.params.id) {
        const response = await getById(route.params.id)
        form.value = response
      }
    })

    // Submete o formulário, criando ou atualizando um concurso
    const onSubmit = async () => {
      try {
        if (form.value.id) {
          await update(form.value)
        } else {
          await post(form.value)
        }
        $q.notify({ message: 'Concurso Salvo com sucesso', icon: 'check', color: 'positive' })
        router.push({ name: 'concursos' })
      } catch (error) {
        $q.notify({ message: 'Erro ao salvar curso', icon: 'times', color: 'negative' })
      }
    }

    return {
      form,
      onSubmit
    }
  }
})
</script>

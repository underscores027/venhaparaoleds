<template>
  <!-- Página principal com padding -->
  <q-page padding>
    <!-- Formulário para adicionar/editar candidatos -->
    <q-form
      @submit="onSubmit"
      class="row q-col-gutter-sm"
    >
      <!-- Campo de entrada para o nome do candidato -->
      <q-input
        outlined
        v-model="form.name"
        label="Nome"
        lazy-rules
        class="col-12"
        :rules="[ val => val && val.length > 0 || 'Campo obrigatório']"
      />

      <!-- Campo de entrada para o CPF do candidato -->
      <q-input
        outlined
        v-model="form.cpf"
        label="cpf"
        lazy-rules
        class="col-12"
        :rules="[ val => val && val.length > 0 || 'Campo obrigatório']"
      />

      <!-- Campo de entrada para a data de nascimento do candidato -->
      <q-date
        outlined
        v-model="form.dataNascimento"
        label="Data de Nascimento"
        class="col-lg-4 col-xs-12"
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
          :to="{ name: 'candidatos' }"
        />
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import candidatosService from 'src/services/candidatos'
import { useQuasar } from 'quasar'
import { useRouter, useRoute } from 'vue-router'

export default defineComponent({
  name: 'FormCandidatos',
  setup () {
    // Inicialização de variáveis e serviços
    const router = useRouter()
    const route = useRoute()
    const $q = useQuasar()
    const { post, getById, update } = candidatosService()
    const form = ref({
      name: '',
      dataNascimento: '',
      cpf: ''
    })

    // Se um ID de candidato for fornecido na URL, preenche o formulário com os dados do candidato
    onMounted(async () => {
      if (route.params.id) {
        const response = await getById(route.params.id)
        form.value = response
      }
    })

    // Submete o formulário, criando ou atualizando um candidato
    const onSubmit = async () => {
      try {
        if (form.value.dataNascimento === '') {
          $q.notify({ message: 'O campo data de nascimento é obrigatório!', icon: 'times', color: 'negative' })
        } else {
          if (form.value.id) {
            await update(form.value)
          } else {
            await post(form.value)
          }
          $q.notify({ message: 'Candidato Salvo com sucesso', icon: 'check', color: 'positive' })
          router.push({ name: 'candidatos' })
        }
      } catch (error) {
        $q.notify({ message: 'Erro ao salvar candidato', icon: 'times', color: 'negative' })
      }
    }

    return {
      form,
      onSubmit
    }
  }
})
</script>

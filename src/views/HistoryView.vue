<template>
  <main>
    <div class="card container">
      <DataTable v-model:expandedRows="expandedRows" :value="history" dataKey="_id" @rowExpand="onRowExpand"
        @rowCollapse="onRowCollapse" tableStyle="min-width: 60rem">
        <template #empty> Nenhuma operação foi realizada.</template>
        <Column expander style="width: 5rem" />

        <Column field="method" header="Método">
          <template #body="slotProps">
            {{ formatMethod(slotProps.data.method) }}
          </template>
        </Column>

        <Column field="createdAt" header="Data">
          <template #body="slotProps">
            {{ formatDate(slotProps.data.createdAt) }}
          </template>
        </Column>

        <template #expansion="slotProps">
          <div class="p-3 deleted" v-if="slotProps?.data?.previous?.length">
            <h5>Removido (-)</h5>
            <DataTable :value="slotProps.data.previous" stripedRows >
              <Column field="name" header="Nome" sortable></Column>
              <Column field="date" header="Data">
                <template #body="slotProps">
                  {{ formatDate(slotProps.data.date) }}
                </template>
              </Column>
              <Column field="gender" header="Gênero" sortable></Column>
              <Column field="nacionality" header="Gênero" sortable></Column>
            </DataTable>
          </div>
          <div class="p-3 created" v-if="slotProps?.data?.current?.length">
            <h5>Inserido (+)</h5>
            <DataTable :value="slotProps.data.current">
              <Column field="name" header="Nome" sortable></Column>
              <Column field="date" header="Data">
                <template #body="slotProps">
                  {{ formatDate(slotProps.data.date) }}
                </template>
              </Column>
              <Column field="gender" header="Gênero" sortable></Column>
              <Column field="nacionality" header="Gênero" sortable></Column>
            </DataTable>
          </div>
        </template>
      </DataTable>
      <Toast />
    </div>
  </main>
</template>

<script>
import { HistoryService } from '@/services/HistoryService'
export default {
  data() {
    return {
      history: null,
      expandedRows: {}
    };
  },
  async mounted() {
    const history = await HistoryService.get()
    this.history = history

  },
  methods: {
    onRowExpand(event) {
    },
    onRowCollapse(event) {
    },
    expandAll() {
      this.expandedRows = this.history.reduce((acc, p) => (acc[p.id] = true) && acc, {});
    },
    collapseAll() {
      this.expandedRows = null;
    },
    formatDate(value) {
      return value.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    formatMethod(value) {
      const methods = {
        POST: 'Criação',
        PATH: 'Edição',
        DELETE: 'Exclusão'
      }
      return methods[value] || 'Edição'
    },
  }
};
</script>

<style scoped>

</style>
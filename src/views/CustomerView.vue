<template>
  <main>
    <Toast />
    <!-- NO-DATA -->
    <div v-if="!customers.length && !loading" class="container no-data">
      <div class="body">
        <h5>Nenhum cliente encontrado</h5>
        <p>Faça o upload de um arquivo .csv para iniciar</p>
        <FileUpload mode="basic" name="demo[]" :custom-upload="true" @uploader="onAdvancedUpload" accept=".csv"
          :maxFileSize="1000000" @upload="onUpload" choose-label="Escolher" :auto="true" />
      </div>
      <img src="../assets/no-data.png">
    </div>


    <div v-if="customers.length || loading" class="card container">
      <h1>Clientes</h1>
      <!-- Toolbar -->
      <Toolbar class="mb-4">
        <template #start>
          <Button label="Novo" icon="pi pi-plus" severity="success" class="mr-2" @click="openNew" />
          <Button label="Excluir" icon="pi pi-trash" severity="danger" @click="deleteCustomerDialog = true"
            :disabled="!selectedCustomers || !selectedCustomers.length" />
        </template>
        <template #end>
          <FileUpload mode="basic" name="demo[]" :custom-upload="true" @uploader="onAdvancedUpload" accept=".csv"
            :maxFileSize="1000000" @upload="onUpload" choose-label="Importar" :auto="true" class="mr-2 inline-block"/>
          <Button label="Exportar" icon="pi pi-download" severity="help" @click="exportCSV($event)" />
        </template>
      </Toolbar>

      <!-- DataTable -->
      <DataTable v-on:filter="onFilter" ref="dt" v-model:selection="selectedCustomers" v-model:filters="filters" :value="customers" paginator :rows="8"
        dataKey="_id" filterDisplay="menu" :loading="loading" :globalFilterFields="['name', 'nacionality', 'gender']">
        <template #header>
          <div class="flex justify-content-between">
            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
            <IconField iconPosition="left">
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText v-model="filters['global'].value" placeholder="Procurar palavra-chave" />
            </IconField>
          </div>
        </template>
        <template #empty> Nenhum cliente encontrado. </template>
        <template #loading> Carregado dados de clientes. Aguarde, por favor. </template>
        <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
        <Column field="name" header="Nome" style="min-width: 12rem">
          <template #body="{ data }">
            {{ data.name }}
          </template>
          <template #filter="{ filterModel }">
            <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Nome" />
          </template>
        </Column>
        <Column field="nacionality" header="Nacionalidade" filterField="nacionality" style="min-width: 12rem">
          <template #body="{ data }">
            <div class="flex align-items-center gap-2">
              <span>{{ data.nacionality }}</span>
            </div>
          </template>
          <template #filter="{ filterModel }">
            <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="País" />
          </template>
          <template #filterclear="{ filterCallback }">
            <Button type="button" icon="pi pi-times" @click="filterCallback()" severity="secondary"></Button>
          </template>
          <template #filterapply="{ filterCallback }">
            <Button type="button" icon="pi pi-check" @click="filterCallback()" severity="success"></Button>
          </template>
        </Column>
        <Column field="date" header="Data de nascimento" filterField="date" dataType="date" style="min-width: 10rem">
          <template #body="{ data }">
            {{ formatDate(data.date) }}
          </template>
          <template #filter="{ filterModel }">
            <Calendar v-model="filterModel.value" dateFormat="mm/dd/yy" placeholder="dd/mm/aaaa" mask="99/99/9999" />
          </template>
        </Column>
        <Column header="Gênero" field="gender" :filterMenuStyle="{ width: '14rem' }" style="min-width: 12rem">
          <template #body="{ data }">
            <Tag :value="data.gender" :severity="getSeverity(data.gender)" />
          </template>
          <template #filter="{ filterModel }">
            <Dropdown v-model="filterModel.value" :options="genders" placeholder="Select One" class="p-column-filter"
              showClear>
              <template #option="slotProps">
                <Tag :value="slotProps.option" :severity="getSeverity(slotProps.option)" />
              </template>
            </Dropdown>
          </template>
        </Column>
        <Column :exportable="false">
          <template #body="slotProps">
            <Button icon="pi pi-pencil" outlined rounded @click="editProduct(slotProps.data)" />
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Create Dialog -->
    <Dialog v-model:visible="customerDialog" :style="{ width: '450px' }" header="Cliente" :modal="true" class="p-fluid">

      <div class="field">
        <label for="name">Nome</label>
        <InputText id="name" v-model.trim="customer.name" required="true" autofocus
          :invalid="submitted && !customer.name" />
        <small class="p-error" v-if="submitted && !customer.name">Nome é obrigatório.</small>
      </div>

      <div class="field">
        <label for="nacionality">Nacionalidade</label>
        <InputText id="nacionality" v-model.trim="customer.nacionality" required="true" autofocus
          :invalid="submitted && !customer.nacionality" />
        <small class="p-error" v-if="submitted && !customer.nacionality">Nacionalidade é obrigatória.</small>
      </div>

      <div class="field">
        <label for="date">Data de nascimento</label>
        <Calendar id="date" v-model.trim="customer.date" required="true" autofocus showIcon iconDisplay="input"
          :invalid="submitted && !customer.date" />
        <small class="p-error" v-if="submitted && !customer.date">Data de nascimento é obrigatória.</small>
      </div>

      <div class="field">
        <label for="gender">Gênero</label>
        <Dropdown id="gender" v-model.trim="customer.gender" :options="genderOptions" optionLabel="name"
          placeholder="Selecione um gênero" class="w-full" required="true" autofocus
          :invalid="submitted && !customer.gender" />
        <small class="p-error" v-if="submitted && !customer.gender">Nacionalidade é obrigatória.</small>
      </div>

      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog" />
        <Button label="Salvar" :disabled="loading" icon="pi pi-check" text @click="saveCustomer" />
      </template>
    </Dialog>

    <!-- Delete Dialog -->
    <Dialog v-model:visible="deleteCustomerDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span>Tem certeza que deseja excluir os clientes selecionados?</span>
      </div>
      <template #footer>
        <Button label="Não" icon="pi pi-times" text @click="deleteCustomerDialog = false" />
        <Button label="Excluir" icon="pi pi-check" text @click="deleteCustomers" />
      </template>
    </Dialog>
  </main>
</template>

<script>
import { defineComponent } from "vue";
import { CustomerService } from '@/services/CustomerService';
import { FilterMatchMode, FilterOperator } from 'primevue/api';

export default defineComponent({
  data() {
    return {
      customer: null,
      customers: [],
      filters: null,
      filteredCustomers: null,
      genders: ['Masculino', 'Feminino'],
      selectedCustomers: null,
      loading: true,
      customerDialog: false,
      deleteCustomerDialog: false,
      edit: false,
      submitted: false,
      genderOptions: [
        { name: 'Masculino', code: 'Masculino' },
        { name: 'Feminino', code: 'Feminino' },
      ]
    };
  },
  created() {
    this.initFilters();
  },
  async mounted() {
    this.loading = true
    const customers = await CustomerService.get()
    this.customers = customers
    this.loading = false
  },
  methods: {
    async onAdvancedUpload(event) {
      const file = event.files[0];
      const customers = await CustomerService.uploadFile(file)
      if (customers.error) {
        this.$toast.add({ severity: 'error', summary: 'Erro', detail: customers.error, life: 3000 });
      } else {
        this.$toast.add({ severity: 'success', summary: 'Sucess', detail: "Clientes salvos com sucesso", life: 3000 });
        await this.getCustomers()
      }
    },
    formatDate(value) {
      return value.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    },
    clearFilter() {
      this.initFilters();
    },
    initFilters() {
      this.filters = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        nacionality: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        gender: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
      };
    },
    async getCustomers() {
      this.loading = true
      const customers = await CustomerService.get()
      this.customers = customers
      this.loading = false
    },
    getSeverity(status) {
      switch (status) {
        case 'Masculino':
          return 'warning';

        case 'Feminino':
          return 'info';
      }
    },
    openNew() {
      this.customer = {};
      this.submitted = false;
      this.customerDialog = true;
    },
    hideDialog() {
      this.customerDialog = false;
      this.deleteCustomerDialog = false;
      this.submitted = false;
    },
    async saveCustomer() {
      this.submitted = true
      if (!this.customer.name || !this.customer.nacionality || !this.customer.gender || !this.customer.date) {
        this.$toast.add({ severity: 'warn', summary: 'Aviso', detail: 'Preencha todos os campos.', life: 3000 });
      } else {
        this.loading = true
        
        const res = this.edit
        ? await CustomerService.edit({ ...this.customer, gender: this?.customer?.gender?.name })
        : await CustomerService.create({ ...this.customer, gender: this?.customer?.gender?.name })
        if (res.error) {
          this.$toast.add({ severity: 'error', summary: 'Erro', detail: res.error, life: 3000 });
        } else {
          this.$toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Cliente salvo com sucesso.', life: 3000 });
        }
        this.edit = false
        this.hideDialog()
        await this.getCustomers()
      }
    },
    editProduct(e) {
      this.customer = {...e, gender: {name: e.gender, code: e.gender}}
      this.submitted = false
      this.edit = true
      this.customerDialog = true
    },
    async deleteCustomers() {
      this.loading = true
      this.hideDialog()
      const res = await CustomerService.delete(this.selectedCustomers)
      if (res.error) {
        this.$toast.add({ severity: 'error', summary: 'Erro', detail: res.error, life: 3000 });
      } else {
        this.$toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Clientes excluídos com sucesso.', life: 3000 });
      }
      await this.getCustomers()
    },
    onFilter(e) {
      this.filteredCustomers = e.filteredValue
    },
    exportCSV() {
      const original = this.filteredCustomers
      const formatted = original.map(c => ({...c, date: this.formatDate(c.date)}))

      this.$refs.dt.exportCSV({}, formatted);
    }
  }
});
</script>

<style lang="css" scoped>

.header {
  margin-bottom: 1rem;
}

h1 {
  margin: 0 0 1rem 0;
  font-size: 20px;
}

img {
  width: calc(100% - 32px);
  max-width: 500px;
}

.no-data {
  margin-top: 4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 961px) {
    justify-content: center;

    .body {
      margin-bottom: 4rem;
    }

    p,
    h5 {
      text-align: center;
    }

    .p-fileupload {
      display: flex;
      justify-content: center;
    }
  }

  h5 {
    font-size: 32px;
    margin: 0;
  }
}
</style>
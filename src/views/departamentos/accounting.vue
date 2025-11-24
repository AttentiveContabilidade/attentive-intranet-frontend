<template>
  <!-- Header global já vem fora -->
  <DepartamentoLayout
    title="ACCOUNTING"
    :leftItems="automacoes"
    :rightItems="ferramentas"
  />
</template>

<script>
import DepartamentoLayout from "../components/DepartamentoLayout.vue";

export default {
  name: "DeptAccView",
  components: { DepartamentoLayout },
  data() {
    return {
      automacoes: [
        { title: "CND Municipal", icon: "/assets/icons/doc-gear.svg", to: { name: "AutomationTax" } },
        { title: "DUC SP",        icon: "/assets/icons/doc-gear.svg", to: { name: "AutomationTax" } },
        { title: "e-CND Est.",    icon: "/assets/icons/doc-gear.svg", to: { name: "AutomationTax" } },
        { title: "Federal RFB",   icon: "/assets/icons/doc-gear.svg", to: { name: "AutomationTax" } },
        { title: "Prevenção",     icon: "/assets/icons/doc-gear.svg", to: { name: "AutomationTax" } },
        { title: "Logs",          icon: "/assets/icons/doc-gear.svg", to: { name: "AutomationTax" } },
      ],
      ferramentas: [
        { title: "Econet",        icon: "/assets/icons/tools.svg", to: { path: "https://www.econeteditora.com.br" } },
        { title: "Domínio",       icon: "/assets/icons/tools.svg", to: { path: "https://www.dominioatendimento.com" } },
        { title: "TIPI",          icon: "/assets/icons/tools.svg", to: { name: "ToolsTax" } },
        { title: "ISS Municípios",icon: "/assets/icons/tools.svg", to: { name: "ToolsTax" } },
        { title: "Tabela CFOP",   icon: "/assets/icons/tools.svg", to: { name: "ToolsTax" } },
        { title: "Relatórios",    icon: "/assets/icons/tools.svg", to: { name: "ReportsTax" } },
      ],
    };
  },
};
</script>

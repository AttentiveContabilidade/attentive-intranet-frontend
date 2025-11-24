<template>
  <!-- Header global já vem fora -->
  <DepartamentoLayout
    title="MARKETING"
    :leftItems="automacoes"
    :rightItems="ferramentas"
  />
</template>

<script>
import DepartamentoLayout from "../components/DepartamentoLayout.vue";

export default {
  name: "DeptMarView",
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
        { title: "Econet",        icon: "../assets/icons/tools.svg", to: { path: "https://www.econeteditora.com.br" } },
        { title: "Domínio",       icon: "/assets/icons/tools.svg", to: { path: "https://www.dominioatendimento.com" } },
        { title: "Gestta",          icon: "/assets/icons/tools.svg", to: { name: "ToolsTax" } },
        { title: "Omie",icon: "/assets/icons/tools.svg", to: { name: "ToolsTax" } },
        { title: "Unecont",   icon: "/assets/icons/tools.svg", to: { name: "ToolsTax" } },
        { title: "Sieg",    icon: "/assets/icons/tools.svg", to: { name: "ReportsTax" } },
        { title: "Kolossus",    icon: "/assets/icons/tools.svg", to: { name: "ReportsTax" } },
        { title: "Onvio",    icon: "/assets/icons/tools.svg", to: { name: "ReportsTax" } },
      ],
    };
  },
};
</script>

<template>
  <!-- Header global já vem fora -->
  <DepartamentoLayout
    title="TAX"
    :leftItems="automacoes"
    :rightItems="ferramentas"
  />
</template>

<script>
import DepartamentoLayout from "../components/DepartamentoLayout.vue";

export default {
  name: "DeptTaxView",
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
        { title: "Econet",        icon: "data:image/png;base64,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", to: { path: "https://www.econeteditora.com.br" } },
        { title: "Domínio",       icon: "https://pbs.twimg.com/profile_images/867736447922712576/DYrIFu5m_400x400.jpg", to: { path: "https://www.dominioweb.com.br/" } },
        { title: "Gestta",          icon: "https://pbs.twimg.com/profile_images/867736447922712576/DYrIFu5m_400x400.jpg", to: { path: "https://onvio.com.br/login/#/" } },
        { title: "Omie",icon: "https://www.omie.com.br/assets/images/logo-omie.png", to: { path: "https://app.omie.com.br/login/" } },
        { title: "Unecont",   icon: "https://app.unecont.com/_img/verde/logo.png", to: { path: "https://app.unecont.com/_login/Login.aspx" } },
        { title: "Sieg",    icon: "https://www.sieg.com/wp-content/uploads/2025/01/LOGO-BLUE.svg", to: { path: "https://www.sieg.com/" } },
        { title: "Kolossus",    icon: "https://kolossus.asisprojetos.com.br/img/autenticacao/KOLOSSUS_ESCURO.png", to: { path: "https://kolossus.asisprojetos.com.br/login?r=eyJlbmMiOiJBMTI4R0NNIiwiYWxnIjoiZGlyIn0..oICku3HsN6rhlC4Q.JgQLK1O7_reWDA.URpRQVEf8JzI5pPokXobiQ" } },
      ],
    };
  },
};
</script>

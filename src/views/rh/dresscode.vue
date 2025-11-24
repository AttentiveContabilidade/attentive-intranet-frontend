<template>
  <div class="dresscode-page text-light">
    <b-container fluid class="py-4 px-4 px-md-5">
      <!-- CABEÇALHO -->
      <section class="mb-4">
        <b-card class="dc-card">
          <h1 class="dc-title mb-2">DRESS CODE</h1>
          <p class="text-info fw-semibold mb-1">
            Promovendo uma imagem profissional
          </p>
          <p class="text-muted small mb-0">
            Versão set/2025 — Cultura Attentive
          </p>
        </b-card>
      </section>

      <!-- POR QUE IMPORTA -->
      <section class="mb-4">
        <b-card class="dc-card">
          <h2 class="dc-section-title">Por que o dress code importa?</h2>
          <p class="mb-3">
            O dress code não é só aparência. Ele transmite respeito, excelência,
            credibilidade e reforça a cultura da empresa. Nossa imagem fala antes
            das palavras e cria a primeira impressão de quem somos.
          </p>

          <div class="row g-3">
            <div class="col-md-4">
              <div class="dc-pill">
                <strong>Respeito e excelência</strong><br />
                Como eu apareço comunica como eu considero o ambiente.
              </div>
            </div>
            <div class="col-md-4">
              <div class="dc-pill">
                <strong>Credibilidade</strong><br />
                A forma como eu me apresento passa segurança para clientes.
              </div>
            </div>
            <div class="col-md-4">
              <div class="dc-pill">
                <strong>Cultura Attentive</strong><br />
                Fortalece nosso posicionamento de confiança e seriedade.
              </div>
            </div>
          </div>

          <p class="mt-3 text-muted small">
            Resumo: imagem pessoal também é mensagem profissional.
          </p>
        </b-card>
      </section>

      <!-- PERSPECTIVA DO CLIENTE -->
      <section class="mb-4">
        <b-card class="dc-card">
          <h2 class="dc-section-title">Perspectiva do cliente</h2>
          <div class="row g-3">
            <div class="col-md-4">
              <div class="dc-box">
                <h5 class="fw-bold mb-2">Primeira impressão</h5>
                <p class="mb-0 small">
                  Clientes percebem organização, seriedade e confiança quando a
                  Attentive se apresenta de forma alinhada.
                </p>
              </div>
            </div>

            <div class="col-md-4">
              <div class="dc-box">
                <h5 class="fw-bold mb-2">Experiência de atendimento</h5>
                <p class="mb-0 small">
                  A imagem pessoal precisa acompanhar o discurso técnico, reforçando
                  coerência e profissionalismo.
                </p>
              </div>
            </div>

            <div class="col-md-4">
              <div class="dc-box">
                <h5 class="fw-bold mb-2">Branding</h5>
                <p class="mb-0 small">
                  Padronização visual fortalece a identidade da Attentive e passa
                  segurança em reuniões, apresentações e fechamentos.
                </p>
              </div>
            </div>
          </div>

          <p class="mt-3 mb-0 text-muted small">
            Resultado: vínculo de confiança mais forte e posicionamento institucional mais sólido.
          </p>
        </b-card>
      </section>

      <!-- REUNIÕES PRESENCIAIS / FORMAL -->
      <section class="mb-4">
        <b-card class="dc-card">
          <h2 class="dc-section-title">Reuniões presenciais (visual executivo / formal)</h2>

          <p class="mb-3">
            Em reuniões presenciais com clientes, adotamos um padrão Social / Executivo /
            Corporativo Profissional. A ideia é transmitir seriedade, segurança e unidade.
          </p>

          <div class="row g-3 mb-4">
            <div class="col-md-4">
              <div class="dc-box">
                <h5 class="fw-bold mb-2">Organização</h5>
                <p class="small mb-0">
                  O RH avisa com antecedência (WhatsApp / Teams) quando teremos reunião presencial.
                </p>
              </div>
            </div>

            <div class="col-md-4">
              <div class="dc-box">
                <h5 class="fw-bold mb-2">Código de vestimenta</h5>
                <p class="small mb-0">
                  Visual executivo/ social bem alinhado: blazer, camisa/blusa discreta,
                  calça alfaiataria e sapato fechado.
                </p>
              </div>
            </div>

            <div class="col-md-4">
              <div class="dc-box">
                <h5 class="fw-bold mb-2">Padronização</h5>
                <p class="small mb-0">
                  Todo mundo no mesmo nível visual. Isso transmite unidade e profissionalismo
                  diante do cliente.
                </p>
              </div>
            </div>
          </div>

          <!-- bloco lado a lado: aceitável x inadequado -->
          <div class="row g-4">
            <!-- ACEITÁVEL -->
            <div class="col-lg-6">
              <div class="dc-block good">
                <div class="dc-block-header text-success">ACEITÁVEL</div>
                <div class="dc-block-sub small text-muted">
                  Visual executivo / reunião com cliente
                </div>

                <ul class="mt-2">
                  <li>Blazer ou jaqueta estruturada</li>
                  <li>Camisa social / blusa discreta</li>
                  <li>Calça alfaiataria / social</li>
                  <li>Sapato fechado discreto</li>
                </ul>

                <div class="dc-img-row">
                  <div
                    v-for="(img, idx) in galleryFormalOk"
                    :key="'formal-ok-'+idx"
                    class="dc-img-card"
                  >
                    <img :src="img.src" :alt="img.alt" />
                    <div class="dc-img-caption">{{ img.caption }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- INADEQUADO -->
            <div class="col-lg-6">
              <div class="dc-block bad">
                <div class="dc-block-header text-danger">INADEQUADO</div>
                <div class="dc-block-sub small text-muted">
                  Coisas que NÃO devem ir para reunião presencial
                </div>

                <ul class="mt-2">
                  <li>Roupas muito casuais / visual de balada</li>
                  <li>Barriga à mostra / transparência</li>
                  <li>Short curto demais</li>
                  <li>Chinelo, pantufa, crocs relax total</li>
                </ul>

                <div class="dc-img-row">
                  <div
                    v-for="(img, idx) in galleryFormalBad"
                    :key="'formal-bad-'+idx"
                    class="dc-img-card"
                  >
                    <img :src="img.src" :alt="img.alt" />
                    <div class="dc-img-caption">{{ img.caption }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </b-card>
      </section>

      <!-- BUSINESS CASUAL -->
      <section class="mb-4">
        <b-card class="dc-card">
          <h2 class="dc-section-title">Business casual (dia a dia)</h2>

          <p class="mb-3">
            Business casual é o padrão base do dia a dia. É menos formal que o traje social
            completo, mas continua profissional. A ideia é conforto + seriedade.
          </p>

          <div class="row g-4">
            <!-- ACEITÁVEL -->
            <div class="col-lg-6">
              <div class="dc-block good">
                <div class="dc-block-header text-success">ACEITÁVEL</div>
                <div class="dc-block-sub small text-muted">
                  Uso diário no escritório / atendimento remoto
                </div>

                <ul class="mt-2">
                  <li>Polo ou camiseta lisa sem estampa gritante</li>
                  <li>Calça jeans escura / calça casual sem rasgos</li>
                  <li>Tênis limpo ou sapato casual discreto</li>
                </ul>

                <div class="dc-img-row">
                  <div
                    v-for="(img, idx) in galleryCasualOk"
                    :key="'casual-ok-'+idx"
                    class="dc-img-card"
                  >
                    <img :src="img.src" :alt="img.alt" />
                    <div class="dc-img-caption">{{ img.caption }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- INADEQUADO -->
            <div class="col-lg-6">
              <div class="dc-block bad">
                <div class="dc-block-header text-danger">INADEQUADO</div>
                <div class="dc-block-sub small text-muted">
                  Exemplos de visual que não é adequado ao ambiente
                </div>

                <ul class="mt-2">
                  <li>Regata, barriga à mostra, transparência</li>
                  <li>Moletom de dormir / short curto demais</li>
                  <li>Chinelo de praia, pantufa, crocs relax total</li>
                </ul>

                <div class="dc-img-row">
                  <div
                    v-for="(img, idx) in galleryCasualBad"
                    :key="'casual-bad-'+idx"
                    class="dc-img-card"
                  >
                    <img :src="img.src" :alt="img.alt" />
                    <div class="dc-img-caption">{{ img.caption }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p class="text-muted small mt-4 mb-0">
            Ideia geral: confortável não é desleixado.
          </p>
        </b-card>
      </section>

      <!-- CALÇADOS -->
      <section class="mb-4">
        <b-card class="dc-card">
          <h2 class="dc-section-title">Calçados</h2>

          <p class="mb-3">
            O calçado precisa acompanhar o tom da roupa. Mesmo no casual, o ideal é limpo,
            fechado e sem aparência de “pijama / praia”.
          </p>

          <div class="row g-4">
            <!-- ACEITÁVEL -->
            <div class="col-lg-6">
              <div class="dc-block good">
                <div class="dc-block-header text-success">ACEITÁVEL</div>
                <div class="dc-block-sub small text-muted">
                  Tênis limpo, sapato fechado discreto, social básico
                </div>

                <ul class="mt-2">
                  <li>Sapato social limpo</li>
                  <li>Tênis limpo e discreto</li>
                  <li>Sapato fechado confortável e alinhado</li>
                </ul>

                <div class="dc-img-row">
                  <div
                    v-for="(img, idx) in galleryShoesOk"
                    :key="'shoes-ok-'+idx"
                    class="dc-img-card"
                  >
                    <img :src="img.src" :alt="img.alt" />
                    <div class="dc-img-caption">{{ img.caption }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- INADEQUADO -->
            <div class="col-lg-6">
              <div class="dc-block bad">
                <div class="dc-block-header text-danger">INADEQUADO</div>
                <div class="dc-block-sub small text-muted">
                  Itens que passam relaxo demais ou chamam mais atenção que a postura
                </div>

                <ul class="mt-2">
                  <li>Chinelo de praia</li>
                  <li>Crocs / pantufa</li>
                  <li>Salto extremamente chamativo</li>
                </ul>

                <div class="dc-img-row">
                  <div
                    v-for="(img, idx) in galleryShoesBad"
                    :key="'shoes-bad-'+idx"
                    class="dc-img-card"
                  >
                    <img :src="img.src" :alt="img.alt" />
                    <div class="dc-img-caption">{{ img.caption }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </b-card>
      </section>

      <!-- ENCERRAMENTO -->
      <section class="mb-5">
        <b-card class="dc-card">
          <h2 class="dc-section-title">Nosso compromisso</h2>

          <ul class="small mb-3">
            <li>Comunicar com clareza e evitar interpretações confusas.</li>
            <li>Equilibrar profissionalismo e conforto no dia a dia.</li>
            <li>Respeitar diversidade, identidade e contexto pessoal.</li>
            <li>Liderança como exemplo de postura e acolhimento.</li>
          </ul>

          <p class="mb-2">
            Mais do que impor regra, a ideia é criar um ambiente respeitoso,
            profissional e verdadeiro — onde todo mundo consiga se sentir parte
            da Attentive e representar a marca com orgulho.
          </p>

          <p class="mb-2">
            Teve dúvida sobre a roupa em um dia importante?
            Fala com seu responsável direto ou com o RH.
          </p>

          <p class="text-info fw-semibold mb-0">
            Obrigado por colaborar com essa cultura 💙
          </p>
        </b-card>
      </section>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'DressCodePage',
  data() {
    return {
      // FORMAL - ACEITÁVEL (reunião presencial / executivo)
      galleryFormalOk: [
        {
          src: 'https://www.suitsexpert.com/wp-content/uploads/business-formal-dress-code-attire-for-men.jpg',
          alt: 'Terno escuro formal masculino',
          caption: 'Masculino formal (terno/blazer, camisa social)',
        },
        {
          src: 'https://gardner-webb.edu/wp-content/uploads/2021/07/womens-dress-code.jpg',
          alt: 'Executivo feminino formal',
          caption: 'Feminino formal (blazer + alfaiataria)',
        },
      ],

      // FORMAL - INADEQUADO
      galleryFormalBad: [
        {
          src: 'https://imgsapp2.correiobraziliense.com.br/app/noticia_127983242361/2016/10/10/552607/20161010162209520383a.jpg',
          alt: 'Roupa inapropriada para reunião',
          caption: 'Roupas muito casuais / visual de balada',
        },
        {
          src: 'https://i.imgur.com/oWeGotW.jpeg',
          alt: 'Short curto e chinelo',
          caption: 'Short curto, barriga à mostra, chinelo → não é reunião presencial',
        },
      ],

      // BUSINESS CASUAL - ACEITÁVEL
      galleryCasualOk: [
        {
          src: 'https://frenchcrown.com/cdn/shop/articles/MEN_S_BUSINESS_CASUAL_ATTIRE_1.jpg?v=1710854936&width=800',
          alt: 'Business casual masculino',
          caption: 'Casual profissional masculino (polo, chino, tênis limpo)',
        },
        {
          src: 'https://i.pinimg.com/736x/f7/8b/44/f78b445f33a08810170b3af3a5c7a0bc.jpg',
          alt: 'Business casual feminino',
          caption: 'Casual profissional feminino (blazer leve + jeans escuro)',
        },
        {
          src: 'https://i.pinimg.com/736x/15/28/8a/15288a3015ef6e192b801537e886c381.jpg',
          alt: 'Blazer claro com gola alta',
          caption: 'Neutro, arrumado, sem estampa agressiva',
        },
      ],

      // BUSINESS CASUAL - INADEQUADO
      galleryCasualBad: [
        {
          src: 'https://imgsapp2.correiobraziliense.com.br/app/noticia_127983242361/2016/10/10/552607/20161010162209520383a.jpg',
          alt: 'Look balada na empresa',
          caption: 'Roupas muito informais / visual de balada',
        },
        {
          src: 'https://i.imgur.com/oWeGotW.jpeg',
          alt: 'Chinelo e short curto',
          caption: 'Short curto, chinelo → não é ambiente profissional',
        },
      ],

      // CALÇADOS - ACEITÁVEL
      galleryShoesOk: [
        {
          src: 'https://i.pinimg.com/736x/15/e1/d1/15e1d1d06d5babe0e1da2afc119fe24c.jpg',
          alt: 'Sapato social masculino marrom',
          caption: 'Sapato social limpo',
        },
        {
          src: 'https://i.pinimg.com/736x/6a/8a/05/6a8a05fbe2c1ad0c7a1e8f9d3ad3a2a8.jpg',
          alt: 'Tênis branco limpo',
          caption: 'Tênis limpo e discreto',
        },
        {
          src: 'https://i.pinimg.com/736x/53/24/5e/53245ea3daae78d4bd2a34d2c18d7e28.jpg',
          alt: 'Sapato fechado feminino baixo',
          caption: 'Fechado, confortável, alinhado',
        },
      ],

      // CALÇADOS - INADEQUADO
      galleryShoesBad: [
        {
          src: 'https://i.pinimg.com/736x/5c/8d/5d/5c8d5d61e8f625b0193f1cd854ea856f.jpg',
          alt: 'Chinelo praia',
          caption: 'Chinelo de praia → evitar',
        },
        {
          src: 'https://i.pinimg.com/736x/12/84/a5/1284a5f98d0801d2a2ef55b7eba5d764.jpg',
          alt: 'Crocs colorido',
          caption: 'Crocs / pantufa → informal demais',
        },
        {
          src: 'https://i.pinimg.com/736x/6d/bd/80/6dbd8040f0ce8dd71293b6542f245f5b.jpg',
          alt: 'Salto muito exagerado',
          caption: 'Salto extremamente chamativo → não recomendado',
        },
      ],
    }
  },
}
</script>

<style scoped>
.dresscode-page {
  background-color: #0e1a36;
  min-height: 100vh;
  color: #fff;
}

/* Card container geral */
.dc-card {
  background: #101b4f;
  border-radius: 16px;
  border: 2px solid rgba(255, 255, 255, 0.08);
  color: #fff;
  padding: 1.5rem 1.5rem 1.25rem;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
}

/* Títulos */
.dc-title {
  font-size: 1.6rem;
  font-weight: 800;
  color: #fff;
  line-height: 1.2;
}
.dc-section-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #9cc4ff;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  margin-bottom: 1rem;
}

/* Blocos informativos iniciais */
.dc-pill {
  background: rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 12px 16px;
  font-size: 0.875rem;
  line-height: 1.4;
  min-height: 100%;
  color: #fff;
}

.dc-box {
  background: rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 16px;
  font-size: 0.85rem;
  line-height: 1.4;
  min-height: 100%;
  color: #fff;
}

/* BLOCO PRINCIPAL (verde / vermelho) */
.dc-block {
  background: rgba(0, 0, 0, 0.25);
  border-radius: 12px;
  border: 2px solid;
  padding: 16px;
  color: #fff;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.6);
}

.dc-block.good {
  border-color: rgba(0, 255, 0, 0.4);
}
.dc-block.bad {
  border-color: rgba(255, 0, 0, 0.4);
}

.dc-block-header {
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.9rem;
}
.dc-block-sub {
  margin-top: 4px;
  margin-bottom: 12px;
  color: rgba(255, 255, 255, 0.6) !important;
}

/* lista dentro dos blocos */
.dc-block ul {
  font-size: 0.9rem;
  padding-left: 1.2rem;
  margin-bottom: 16px;
}
.dc-block li {
  margin-bottom: 6px;
}

/* GALERIA horizontal de itens (2~3 cards lado a lado) */
.dc-img-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.dc-img-card {
  background: rgba(0, 0, 0, 0.4);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 8px;
  flex: 1 1 240px;
  max-width: 320px;
  min-width: 200px;
  display: flex;
  flex-direction: column;
}

.dc-img-card img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  object-fit: cover;
  background: #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.15);
}
.dc-img-caption {
  font-size: 0.8rem;
  line-height: 1.3;
  color: #ccc;
  margin-top: 6px;
}

/* separador fino usado antes */
.text-muted.small {
  color: rgba(255, 255, 255, 0.5) !important;
}
</style>

<template>
  <div class="container">
    <h1>CSV-faster</h1>
    <div class="block-flex">
      <p>
        O CSV-Faster é uma ferramenta poderosa projetada para simplificar a
        análise de dados a partir de arquivos CSV, oferecendo recursos robustos
        para gerar gráficos informativos de MMR (Monthly Recurring Revenue) e
        Churn Rate.
      </p>
      <p>
        O arquivo csv para ser tratado corretamente pela aplicação precisa estar
        de acordo com o exemplo:
      </p>

      <img src="../assets/image.png" />
    </div>
    <UploadCsvForm />
    <footer>
      <p>
        Desenvolvido por
        <a href="https://github.com/isaias-silva" target="_blank"
          >Isaias Silva</a
        >
      </p>
    </footer>
  </div>
</template>

<script lang="ts">
import UploadCsvForm from "@/components/uploadCsvForm.vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "HomePage",
  components: { UploadCsvForm },
});
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.block-flex {
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.block-flex p {
  flex-shrink: 0;
  width: 100%;
}

h1 {
  font-size: 36px;
  color: #333;
  margin-bottom: 20px;
  text-shadow: 1px 2px 10px #4caf50;
}

p {
  font-size: 18px;
  color: #666;
  line-height: 1.5;
}

footer {
  margin-top: 40px;
  text-align: center;
}

footer p {
  font-size: 14px;
  color: #999;
}

footer a {
  color: #007bff;
  text-decoration: none;
}

footer a:hover {
  text-decoration: underline;
}
</style>

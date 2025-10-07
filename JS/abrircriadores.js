const btnAbrirFicha = document.getElementById("abrirFichaForm"); 
const btnFecharFicha = document.getElementById("fecharFichaForm");
const fichaForm = document.getElementById("formsBack");

const forms = document.getElementById("criar-ficha");

btnAbrirFicha.addEventListener("click", () =>
{
    fichaForm.classList.add("show-form");
})

btnFecharFicha.addEventListener("click", () =>
{
    fichaForm.classList.remove("show-form");
})



function salvaFicha()
{
    const nome = document.getElementById("nome");
    const classe = document.getElementById("classe");
    const nivel = document.getElementById("nivel");
    const vida = document.getElementById("vida");
    const detalhes = document.getElementById("detalhes");

    const construct = {
        nome: nome.value,
        classe: classe.value,
        nivel: nivel.value,
        hp: vida.value,
        detalhes: detalhes.value
    };
    addFichaCard(construct);

    fichaForm.classList.remove("show-form");
    forms.reset();
}
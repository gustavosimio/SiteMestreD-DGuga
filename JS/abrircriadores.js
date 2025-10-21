const btnAbrirFicha = document.getElementById("abrirFichaForm"); 
const btnFecharFicha = document.getElementById("fecharFichaForm");
const fichaForm = document.getElementById("formsBack");
const fichaFormElement = document.getElementById("criar-ficha");
const nomeInput = document.getElementById("nome");

btnAbrirFicha.addEventListener("click", () =>
{
    fichaForm.classList.add("show-form");
    if (nomeInput)
    {
        nomeInput.focus();
    }
});

btnFecharFicha.addEventListener("click", () =>
{
    fichaForm.classList.remove("show-form");
});

if (fichaForm)
{
    fichaForm.addEventListener("click", (event) =>
    {
        if (event.target === fichaForm)
        {
            fichaForm.classList.remove("show-form");
        }
    });
}

if (fichaFormElement)
{
    fichaFormElement.addEventListener("submit", (event) =>
    {
        event.preventDefault();
        salvaFicha();
    });
}

function salvaFicha()
{
    const nome = document.getElementById("nome");
    const classe = document.getElementById("classe");
    const nivel = document.getElementById("nivel");
    const vida = document.getElementById("vida");
    const detalhes = document.getElementById("detalhes");

    if (!nome.value.trim())
    {
        nome.focus();
        return;
    }

    const construct = {
        nome: nome.value.trim(),
        classe: classe.value,
        nivel: nivel.value,
        hp: vida.value,
        detalhes: detalhes.value.trim()
    };
    addFichaCard(construct);
    salvarFichas();
    atualizarEmptyStates();

    fichaForm.classList.remove("show-form");
    fichaFormElement.reset();
}
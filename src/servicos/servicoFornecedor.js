const urlBase = 'https://backend-produto-categoria-5wad.vercel.app/fornecedores';

export async function gravarFornecedor(fornecedor){
    const resposta = await fetch(urlBase,{
        'method':"POST",
        'headers': { 
            'Content-Type':"application/json"
        },
        'body': JSON.stringify(fornecedor)
    });
    const resultado = await resposta.json();
    return resultado;
}

export async function alterarFornecedor(fornecedor){
    let cnpj = fornecedor.cnpj;
    cnpj=encodeURIComponent(cnpj);
    const resposta = await fetch(urlBase + "/" + cnpj,{
        'method':"PUT",
        'headers': { 
            'Content-Type':"application/json"
        },
        'body': JSON.stringify(fornecedor)
    });
    const resultado = await resposta.json();
    return resultado;
}

export async function excluirFornecedor(fornecedor){
    let cnpj = fornecedor.cnpj;
    cnpj=encodeURIComponent(cnpj);
    const resposta = await fetch(urlBase + "/" + cnpj,{
        'method':"DELETE",
    });
    const resultado = await resposta.json();
    return resultado;
}

export async function consultarFornecedor() {
    const resposta = await fetch(urlBase,{
        'method':"GET"
    });
    const resultado = await resposta.json();
    return resultado;
}
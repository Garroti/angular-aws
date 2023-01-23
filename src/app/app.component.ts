import { Component } from '@angular/core';
import { Produto } from './model/produto';
import { ProdutoService } from './service/produto.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  produtos: Produto[] = [];

  produtoForm = this.fb.group({
    id: [],
    nome: [null, Validators.required],
    descricao: [null],
    valor: [null, Validators.required],
  });

  constructor(private fb: FormBuilder, private service: ProdutoService) {
    this.buscarProdutos();
  }

  buscarProdutos() {
    this.service.buscarTodos().subscribe({
      next: (res) => {
        this.produtos = res;
        console.log(res);
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => console.log('lista de produtos', this.produtos),
    });
  }

  criarProduto(): Produto {
    return {
      id: this.produtoForm.get('id')?.value,
      nome: this.produtoForm.get('nome')?.value,
      descricao: this.produtoForm.get('descricao')?.value,
      valor: this.produtoForm.get('valor')?.value,
    };
  }

  salvar() {
    if (this.produtoForm.valid) {
      const produto = this.criarProduto();
      this.service.salvar(produto).subscribe({
        next: (res: any) => {
          this.produtoForm.reset();
          this.buscarProdutos();
          alert('Produto salvo com sucesso');
        },
        error: (error: any) => {
          console.log(error);
        },
        complete: () => console.log('produto salvo'),
      });
    }
  }

  remover(produto: Produto) {
    const confirmacao = confirm('Quer realmente excluir esse produto?');
    if (confirmacao) {
      this.service.remover(produto.id).subscribe({
        next: () => {
          this.buscarProdutos();
          alert('Produto removido com sucesso');
        },
      });
    }
  }
}

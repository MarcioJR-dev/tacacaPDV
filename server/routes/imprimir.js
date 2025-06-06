const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { Pedido, Cliente, Produto } = require('../models');

// Função para formatar valor com 2 casas decimais
const formatarValor = (valor) => {
    const valorNumerico = parseFloat(valor) || 0;
    return valorNumerico.toFixed(2).replace('.', ',');
};

// Função para formatar item do pedido
const formatarItem = (item) => {
    try {
        console.log('Formatando item:', item);
        console.log('Dados do pedido_produto:', item.pedido_produto);
        console.log('Quantidade raw:', item.pedido_produto.dataValues.quantidade);
        
        const nome = (item.nome || '').padEnd(25);
        const quantidade = parseInt(item.pedido_produto.dataValues.quantidade) || 0;
        const preco = parseFloat(item.preco) || 0;
        const total = quantidade * preco;
        
        console.log(`Item ${nome}: quantidade=${quantidade}, preco=${preco}, total=${total}`);
        return `${quantidade} ${nome} ${formatarValor(total)}`;
    } catch (error) {
        console.error('Erro ao formatar item:', error);
        return 'Erro ao formatar item';
    }
};

router.post('/gerar-txt', async (req, res) => {
    try {
        console.log('Recebendo requisição de impressão...');
        const { pedidoId } = req.body;
        console.log('ID do pedido:', pedidoId);

        if (!pedidoId) {
            console.error('ID do pedido não fornecido');
            return res.status(400).json({ error: 'ID do pedido é obrigatório' });
        }

        // Buscar dados do pedido
        console.log('Buscando dados do pedido...');
        const pedido = await Pedido.findByPk(pedidoId, {
            include: [
                {
                    model: Cliente,
                    as: 'cliente'
                },
                {
                    model: Produto,
                    as: 'produtos',
                    through: { attributes: ['quantidade'] }
                }
            ]
        });

        if (!pedido) {
            console.log('Pedido não encontrado');
            return res.status(404).json({ error: 'Pedido não encontrado' });
        }

        console.log('Pedido encontrado:', pedido.id);
        console.log('Dados completos do pedido:', JSON.stringify(pedido, null, 2));

        // Template do pedido
        const template = `--------------------------------
       Tacacá Distribuidora
     Rua João Scuissiato, 78
         (41) 99720-3338
    CNPJ: 53.953.479/0001-47

--------------------------------
CLIENTE: {{nome_cliente}}
TELEFONE: {{telefone_cliente}}
ENDEREÇO: {{endereco_cliente}}
NOTAS: {{notas_cliente}}

            (Pedido)
ITEM (V.Unit)               Total

{{itens_pedido}}
TAXA DE ENTREGA             {{taxa_entrega}}

---------------------------------
TOTAL:                     {{valor_total}}

             {{data_pedido}}
   * Obrigado pela Preferencia! *
           Volte Sempre!
-----------------------------------




.

`;

        // Formatar itens do pedido
        console.log('Formatando itens do pedido...');
        console.log('Produtos do pedido:', JSON.stringify(pedido.produtos, null, 2));
        const itensFormatados = pedido.produtos.map(formatarItem).join('\n');
        console.log('Itens formatados:', itensFormatados);

        // Usar taxa de entrega do cliente ou valor padrão
        const taxaEntrega = pedido.cliente?.taxa_entrega || 0.00;
        console.log('Taxa de entrega:', taxaEntrega);

        // Calcular valor total
        const valorTotal = pedido.produtos.reduce((total, produto) => {
            console.log('Calculando total para produto:', produto.nome);
            console.log('Quantidade:', produto.pedido_produto.dataValues.quantidade);
            console.log('Preço:', produto.preco);
            
            const quantidade = parseInt(produto.pedido_produto.dataValues.quantidade) || 0;
            const preco = parseFloat(produto.preco) || 0;
            const subtotal = quantidade * preco;
            
            console.log(`Subtotal para ${produto.nome}: ${subtotal}`);
            return total + subtotal;
        }, 0);

        console.log('Valor total calculado:', valorTotal);
        console.log('Valor total com taxa:', valorTotal + parseFloat(taxaEntrega));

        // Substituir variáveis no template
        console.log('Substituindo variáveis no template...');
        const data = new Date(pedido.data);
        
        const conteudo = template
            .replace('{{nome_cliente}}', pedido.cliente?.nome || '')
            .replace('{{telefone_cliente}}', pedido.cliente?.telefone || '')
            .replace('{{endereco_cliente}}', pedido.cliente?.endereco || '')
            .replace('{{notas_cliente}}', pedido.cliente?.notas || '')
            .replace('{{itens_pedido}}', itensFormatados)
            .replace('{{taxa_entrega}}', formatarValor(taxaEntrega))
            .replace('{{valor_total}}', formatarValor(valorTotal + parseFloat(taxaEntrega)))
            .replace('{{data_pedido}}', data.toLocaleDateString('pt-BR'));

        // Gerar nome do arquivo
        const fileName = `pedido_${pedido.id}_${Date.now()}.txt`;
        const filePath = path.join(__dirname, '../temp', fileName);
        console.log('Caminho do arquivo:', filePath);

        // Garantir que o diretório temp existe
        console.log('Criando diretório temp se não existir...');
        await fs.mkdir(path.dirname(filePath), { recursive: true });

        // Salvar arquivo
        console.log('Salvando arquivo...');
        await fs.writeFile(filePath, conteudo, 'utf8');
        console.log('Arquivo salvo com sucesso');

        // Abrir no Notepad e imprimir automaticamente
        console.log('Enviando para impressão...');
        const printCommand = `cmd /c start /min notepad /p "${filePath}"`;
        console.log('Comando de impressão:', printCommand);
        
        exec(printCommand, (error, stdout, stderr) => {
            if (error) {
                console.error('Erro ao imprimir:', error);
                console.error('Erro detalhado:', stderr);
                return res.status(500).json({ 
                    error: 'Erro ao imprimir',
                    details: error.message,
                    stderr: stderr
                });
            }
            
            console.log('Arquivo enviado para impressão com sucesso');
            console.log('Saída do comando:', stdout);
            
            // Remover arquivo temporário após alguns segundos
            setTimeout(async () => {
                try {
                    await fs.unlink(filePath);
                    console.log('Arquivo temporário removido');
                } catch (err) {
                    console.error('Erro ao remover arquivo temporário:', err);
                }
            }, 5000);

            res.json({ 
                message: 'Arquivo enviado para impressão com sucesso',
                filePath: filePath
            });
        });

    } catch (error) {
        console.error('Erro detalhado:', error);
        res.status(500).json({ 
            error: 'Erro ao gerar arquivo de impressão',
            details: error.message,
            stack: error.stack
        });
    }
});

module.exports = router; 
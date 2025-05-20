const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Função para formatar valor com 2 casas decimais
const formatarValor = (valor) => valor.toFixed(2).replace('.', ',');

// Função para formatar item do pedido
const formatarItem = (item) => {
    const nome = item.produto.nome.padEnd(25);
    const valorUnit = formatarValor(item.valor_unitario);
    const total = formatarValor(item.quantidade * item.valor_unitario);
    return `${item.quantidade} ${nome} ${total}`;
};

router.post('/gerar-txt', async (req, res) => {
    try {
        const { pedidoId } = req.body;

        // Buscar dados do pedido
        const pedido = await prisma.pedido.findUnique({
            where: { id: pedidoId },
            include: {
                cliente: true,
                itens: {
                    include: {
                        produto: true
                    }
                }
            }
        });

        if (!pedido) {
            return res.status(404).json({ error: 'Pedido não encontrado' });
        }

        // Ler o template
        const templatePath = path.join(__dirname, '../templates/pedido_template.txt');
        let template = await fs.readFile(templatePath, 'utf8');

        // Formatar itens do pedido
        const itensFormatados = pedido.itens.map(formatarItem).join('\n');

        // Calcular taxa de entrega (exemplo: 15,00)
        const taxaEntrega = 15.00;

        // Substituir variáveis no template
        const data = new Date(pedido.data);
        const conteudo = template
            .replace('{{endereco_cliente}}', pedido.cliente.endereco || '')
            .replace('{{itens_pedido}}', itensFormatados)
            .replace('{{taxa_entrega}}', formatarValor(taxaEntrega))
            .replace('{{valor_total}}', formatarValor(pedido.valor_total + taxaEntrega))
            .replace('{{data_pedido}}', data.toLocaleDateString('pt-BR'));

        // Gerar nome do arquivo
        const fileName = `pedido_${pedido.id}_${Date.now()}.txt`;
        const filePath = path.join(__dirname, '../temp', fileName);

        // Garantir que o diretório temp existe
        await fs.mkdir(path.dirname(filePath), { recursive: true });

        // Salvar arquivo
        await fs.writeFile(filePath, conteudo, 'utf8');

        // Enviar para impressão
        exec(`notepad /p "${filePath}"`, (error) => {
            if (error) {
                console.error('Erro ao imprimir:', error);
                return res.status(500).json({ error: 'Erro ao imprimir' });
            }
            
            // Remover arquivo temporário após alguns segundos
            setTimeout(async () => {
                try {
                    await fs.unlink(filePath);
                } catch (err) {
                    console.error('Erro ao remover arquivo temporário:', err);
                }
            }, 5000);

            res.json({ message: 'Arquivo gerado e enviado para impressão com sucesso' });
        });

    } catch (error) {
        console.error('Erro ao gerar arquivo:', error);
        res.status(500).json({ error: 'Erro ao gerar arquivo de impressão' });
    }
});

module.exports = router; 
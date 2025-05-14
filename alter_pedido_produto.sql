-- Adiciona coluna quantidade na tabela pedido_produto
ALTER TABLE `pedido_produto` 
ADD COLUMN `quantidade` INT NOT NULL DEFAULT 1 AFTER `produto_id`;

-- Atualiza os registros existentes
UPDATE `pedido_produto` SET `quantidade` = 1 WHERE `quantidade` IS NULL; 
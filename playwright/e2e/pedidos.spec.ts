import { test, expect } from '@playwright/test'

import { generateOrderCode } from '../support/helpers'

/// AAA - Arrange, Act, Assert

test.describe('Consulta de Pedidos', () => {

  test.beforeEach(async ({ page }) => {
    //Arrange
    await page.goto('http://localhost:5173/')
    await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint')

    await page.getByRole('link', { name: 'Consultar Pedido' }).click()
    await expect(page.getByRole('heading')).toContainText('Consultar Pedido')
  })



  test('deve consultar um pedido aprovado', async ({ page }) => {

    // Test Data
    const order = 'VLO-K5ABJO'


    // Act
    await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order)
    await page.getByTestId('search-order-button').click()

    // Assert

    // const orderCode = page.locator('/p[text()="Pedido"]/..//p[text()="VLO-K5ABJO"]')
    // await expect(orderCode).toBeVisible({timeout: 10_000})

    const resultadoPedido = page.getByTestId('order-result-' + order)

    await expect(resultadoPedido).toMatchAriaSnapshot(`
      - img
      - paragraph: Pedido
      - paragraph: ${order}
      - img
      - text: APROVADO
    `, { timeout: 10_000 })

    await expect(resultadoPedido).toMatchAriaSnapshot(`
      - img "Velô Sprint"
      - paragraph: Modelo
      - paragraph: Velô Sprint
      - paragraph: Cor
      - paragraph: Glacier Blue
      - paragraph: Interior
      - paragraph: cream
      - paragraph: Rodas
      - paragraph: aero Wheels
      - heading "Dados do Cliente" [level=4]
      - paragraph: Nome
      - paragraph: ${order}Luiz
      - paragraph: Email
      - paragraph: aluiztenorio@gmail.com
      - paragraph: Loja de Retirada
      - paragraph
      - paragraph: Data do Pedido
      - paragraph: /\\d+\\/\\d+\\/\\d+/
      - heading "Pagamento" [level=4]
      - paragraph: À Vista
      - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
    `)

  })

  test('deve exibir mensagem quando o pedido não for encontrado', async ({ page }) => {

    // Test Data
    const order = generateOrderCode() // This will be generated but not used in the test

    await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order)
    await page.getByTestId('search-order-button').click()


    await expect(page.locator('#root')).toMatchAriaSnapshot(`
    - img
    - heading "Pedido não encontrado" [level=3]
    - paragraph: Verifique o número do pedido e tente novamente
    `)


  })

})

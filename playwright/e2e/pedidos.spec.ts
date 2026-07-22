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
    // const order = 'VLO-K5ABJO'

    const order = {
      number: 'VLO-K5ABJO',
      color: 'Glacier Blue',
      wheels: 'aero Wheels',
      customer: {
        name: 'André Luiz',
        email: 'aluiztenorio@gmail.com',
      },
      payment: 'À Vista',
  
    }


    // Act
    await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order.number)
    await page.getByTestId('search-order-button').click()

    // Assert

    const resultadoPedido = page.getByTestId(`order-result-${order.number}`)

    await expect(resultadoPedido).toMatchAriaSnapshot(`
      - img
      - paragraph: Pedido
      - paragraph: ${order.number}
      - img
      - text: APROVADO
    `, { timeout: 10_000 })

    await expect(resultadoPedido).toMatchAriaSnapshot(`
      - img "Velô Sprint"
      - paragraph: Modelo
      - paragraph: Velô Sprint
      - paragraph: Cor
      - paragraph: ${order.color}
      - paragraph: Interior
      - paragraph: cream
      - paragraph: Rodas
      - paragraph: ${order.wheels}
      - heading "Dados do Cliente" [level=4]
      - paragraph: Nome
      - paragraph: ${order.customer.name}
      - paragraph: Email
      - paragraph: ${order.customer.email}
      - paragraph: Loja de Retirada
      - paragraph
      - paragraph: Data do Pedido
      - paragraph: /\\d+\\/\\d+\\/\\d+/
      - heading "Pagamento" [level=4]
      - paragraph: ${order.payment}
      - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
    `)

  })

  test('deve consultar um pedido reprovado', async ({ page }) => {
    

    // Test Data
    // const order = 'VLO-DFDHE2'

      const order = {
       number: 'VLO-DFDHE2',
       status: 'REPROVADO',
       color: 'Midnight Black',
       wheels: 'sport Wheels',
       customer: {
        name: 'Esteve Jobs',
        email: 'jobs@apple.com',
      },
      payment: 'À Vista',
  
    }


    // Act
    await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order.number)
    await page.getByTestId('search-order-button').click()

    // Assert

    // const orderCode = page.locator('/p[text()="Pedido"]/..//p[text()="VLO-K5ABJO"]')
    // await expect(orderCode).toBeVisible({timeout: 10_000})

    const resultadoPedido = page.getByTestId(`order-result-${order.number}`)

    await expect(resultadoPedido).toMatchAriaSnapshot(`
      - img
      - paragraph: Pedido
      - paragraph: ${order.number}
      - img
      - text: ${order.status}
    `, { timeout: 10_000 })

    await expect(resultadoPedido).toMatchAriaSnapshot(`
      - img "Velô Sprint"
      - paragraph: Modelo
      - paragraph: Velô Sprint
      - paragraph: Cor
      - paragraph: Midnight Black
      - paragraph: Interior
      - paragraph: cream
      - paragraph: Rodas
      - paragraph: sport Wheels
      - heading "Dados do Cliente" [level=4]
      - paragraph: Nome
      - paragraph: Esteve Jobs
      - paragraph: Email
      - paragraph: jobs@apple.com
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

import { test, expect } from '@playwright/test'

/// AAA - Arrange, Act, Assert

test('deve consultar um pedido aprovado', async ({ page }) => {

  // Test Data
  const order = 'VLO-K5ABJO'

  //Arrange
  await page.goto('http://localhost:5173/')
  await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint')

  await page.getByRole('link', { name: 'Consultar Pedido' }).click()
  await expect(page.getByRole('heading')).toContainText('Consultar Pedido')

  // Act
  await page.getByRole('textbox', { name: 'Número do Pedido' }).fill('VLO-K5ABJO')
  await page.getByTestId('search-order-button').click()

  // Assert  

  // const orderCode = page.locator('/p[text()="Pedido"]/..//p[text()="VLO-K5ABJO"]')
  // await expect(orderCode).toBeVisible({timeout: 10_000})

  // const containerPedido = page
  //   .getByRole('paragraph')
  //   .filter({ hasText: /^Pedido$/ })
  //   .locator('..') //Sobe para o elemento pai (a div que agrupa ambos)

  // await expect(containerPedido).toContainText('VLO-K5ABJO', { timeout: 10_000 })

  // await expect(page.getByText('APROVADO')).toBeVisible()

    await expect(page.getByTestId(`order-result-${order}`)).toMatchAriaSnapshot(`
    - img
    - paragraph: Pedido
    - paragraph: ${order}
    - img
    - text: APROVADO
    `);
  await expect(page.getByTestId(`order-result-${order}`)).toMatchAriaSnapshot(`
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
    `);

})

test('deve exibir mensagem quando o pedido não for encontrado', async ({ page }) => {

   // Test Data
  const order = 'VLO-ABC123'

  await page.goto('http://localhost:5173/')
  await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint')

  await page.getByRole('link', { name: 'Consultar Pedido' }).click()
  await expect(page.getByRole('heading')).toContainText('Consultar Pedido')

  await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order)
  await page.getByTestId('search-order-button').click()

  
  await expect(page.locator('#root')).toMatchAriaSnapshot(`
    - img
    - heading "Pedido não encontrado" [level=3]
    - paragraph: Verifique o número do pedido e tente novamente
    `)


})
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

    const containerPedido = page.getByRole('paragraph')
    .filter({ hasText: /^Pedido$/ })
    .locator('..') //Sobe para o elemento pai (a div que agrupa ambos)

  await expect(containerPedido).toContainText('VLO-K5ABJO', { timeout: 10_000 })

  await expect(page.getByText('APROVADO')).toBeVisible()

})
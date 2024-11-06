import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(series)/series')({
  component: Series,
})

function Series() {
  return <div>Series</div>
}

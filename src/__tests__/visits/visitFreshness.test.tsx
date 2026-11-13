import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, render, screen, waitFor } from '@testing-library/react'
import { focusManager, onlineManager, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import TableVisits from '@/features/visits/pages/TableVisits'
import EditVisit from '@/features/visits/pages/EditVisit'
import { getVisitByIdAPI, getVisitsAPI } from '@/features/visits/api/VisitAPI'
import type { VisitResponse } from '@/features/visits/schema/Types'

vi.mock('@/features/visits/api/VisitAPI', () => ({
    getVisitsAPI: vi.fn(),
    getVisitByIdAPI: vi.fn(),
    deleteVisitAPI: vi.fn(),
    updateVisitAPI: vi.fn(),
    tempExitAPI: vi.fn(),
    reingresoAPI: vi.fn(),
}))
vi.mock('@/hooks/useAuth', () => ({
    useAuth: () => ({ permissions: ['visits:checkin', 'visits:checkout'] }),
}))

const activeVisit: VisitResponse = {
    id: 1,
    entry_time: '08:00:00',
    exit_time: null,
    visit_status: { id: 2, name: 'EN PLANTA' },
    company_person: { id: 1, name: 'Visitante anterior', document_number: '123' },
}
const scheduledVisit: VisitResponse = {
    id: 2,
    visit_status: { id: 1, name: 'PROGRAMADA' },
    company_person: { id: 2, name: 'Visitante pendiente', document_number: '456' },
}
const closedVisit: VisitResponse = {
    ...activeVisit,
    exit_time: '12:00:00',
    visit_status: { id: 3, name: 'FINALIZADA' },
}
const currentList = { visits: [scheduledVisit], lastPage: 1 }
const clients: QueryClient[] = []

function createClient() {
    // Reproduce la configuracion global que permitia conservar estados antiguos.
    const client = new QueryClient({ defaultOptions: { queries: {
        staleTime: 5 * 60_000,
        gcTime: 10 * 60_000,
        refetchOnWindowFocus: false,
        retry: false,
    } } })
    clients.push(client)
    return client
}

function renderView(client: QueryClient, detail = false) {
    return render(
        <QueryClientProvider client={client}>
            <MemoryRouter initialEntries={[detail ? '/visit/1/edit' : '/visits']}>
                <Routes>
                    <Route path="/visits" element={<TableVisits />} />
                    <Route path="/visit/:visitId/edit" element={<EditVisit />} />
                </Routes>
            </MemoryRouter>
        </QueryClientProvider>,
    )
}

beforeEach(() => {
    vi.resetAllMocks()
    vi.useFakeTimers({ shouldAdvanceTime: true })
    focusManager.setFocused(true)
    onlineManager.setOnline(true)
})

afterEach(() => {
    cleanup()
    clients.splice(0).forEach(client => client.clear())
    focusManager.setFocused(undefined)
    onlineManager.setOnline(true)
    vi.useRealTimers()
})

describe('vigencia del estado de las visitas', () => {
    it('consulta de nuevo al entrar y oculta la lista guardada hasta recibir la respuesta', async () => {
        const client = createClient()
        const today = new Intl.DateTimeFormat('en-CA', {
            timeZone: 'America/Guatemala', year: 'numeric', month: '2-digit', day: '2-digit',
        }).format(new Date())
        client.setQueryData(['visits', today, 1, { name: '', document_number: '', company_name: '' }], {
            visits: [activeVisit], lastPage: 1,
        })
        let complete!: (value: typeof currentList) => void
        vi.mocked(getVisitsAPI).mockImplementation(() => new Promise(resolve => { complete = resolve }))

        renderView(client)

        expect(screen.getByText('Cargando visitas...')).toBeInTheDocument()
        expect(screen.queryByText('EN PLANTA')).not.toBeInTheDocument()
        await waitFor(() => expect(getVisitsAPI).toHaveBeenCalledWith(1, expect.objectContaining({
            exclude_status: 'FINALIZADA',
        })))
        await act(async () => { complete(currentList) })
        expect((await screen.findAllByText('Visitante pendiente')).length).toBeGreaterThan(0)
        expect(screen.queryByText('Visitante anterior')).not.toBeInTheDocument()
    })

    it('retira una visita cerrada en otra sesion sin recargar la pagina', async () => {
        vi.mocked(getVisitsAPI)
            .mockResolvedValueOnce({ visits: [activeVisit], lastPage: 1 })
            .mockResolvedValue(currentList)
        renderView(createClient())
        expect((await screen.findAllByText('EN PLANTA')).length).toBeGreaterThan(0)

        await act(async () => { await vi.advanceTimersByTimeAsync(15_000) })

        expect((await screen.findAllByText('PROGRAMADA')).length).toBeGreaterThan(0)
        expect(screen.queryByText('EN PLANTA')).not.toBeInTheDocument()
    })

    it.each(['focus', 'reconnect'])('actualiza al recuperar %s', async event => {
        vi.mocked(getVisitsAPI)
            .mockResolvedValueOnce({ visits: [activeVisit], lastPage: 1 })
            .mockResolvedValue(currentList)
        renderView(createClient())
        await screen.findAllByText('EN PLANTA')

        await act(async () => {
            if (event === 'focus') {
                focusManager.setFocused(false)
                focusManager.setFocused(true)
            } else {
                onlineManager.setOnline(false)
                onlineManager.setOnline(true)
            }
        })

        expect((await screen.findAllByText('PROGRAMADA')).length).toBeGreaterThan(0)
        expect(screen.queryByText('EN PLANTA')).not.toBeInTheDocument()
    })

    it('verifica el detalle guardado antes de mostrar las acciones de una visita', async () => {
        const client = createClient()
        client.setQueryData(['visit', '1'], activeVisit)
        let complete!: (value: VisitResponse) => void
        vi.mocked(getVisitByIdAPI).mockImplementation(() => new Promise(resolve => { complete = resolve }))
        renderView(client, true)

        expect(screen.getByText('Cargando datos de la visita...')).toBeInTheDocument()
        expect(screen.queryByRole('link', { name: /registrar salida/i })).not.toBeInTheDocument()
        await waitFor(() => expect(getVisitByIdAPI).toHaveBeenCalledWith(1))
        await act(async () => { complete(closedVisit) })

        expect(await screen.findByText('Esta visita ya no puede ser modificada.')).toBeInTheDocument()
        expect(screen.queryByRole('link', { name: /registrar salida/i })).not.toBeInTheDocument()
    })

    it('muestra un error si no puede verificar el detalle en lugar de habilitar acciones guardadas', async () => {
        const client = createClient()
        client.setQueryData(['visit', '1'], activeVisit)
        vi.mocked(getVisitByIdAPI).mockRejectedValue(new Error('Sin conexion'))
        renderView(client, true)

        expect(await screen.findByText('Error al cargar la visita.')).toBeInTheDocument()
        expect(screen.queryByRole('link', { name: /registrar salida/i })).not.toBeInTheDocument()
    })
})

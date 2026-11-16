import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
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
const currentList = { visits: [scheduledVisit], lastPage: 1, total: 1 }
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

describe('buscador de visitas', () => {
    it('espera a que termine de escribir y consulta una sola vez con el texto completo', async () => {
        vi.mocked(getVisitsAPI).mockResolvedValue(currentList)
        renderView(createClient())
        await screen.findAllByText('Visitante pendiente')
        const input = screen.getByLabelText('Nombre del visitante')

        fireEvent.change(input, { target: { value: 'V' } })
        await act(async () => { await vi.advanceTimersByTimeAsync(150) })
        fireEvent.change(input, { target: { value: 'Vic' } })
        await act(async () => { await vi.advanceTimersByTimeAsync(150) })
        fireEvent.change(input, { target: { value: 'Victor' } })
        expect(getVisitsAPI).toHaveBeenCalledTimes(1)
        await act(async () => { await vi.advanceTimersByTimeAsync(450) })

        expect(getVisitsAPI).toHaveBeenCalledTimes(2)
        expect(getVisitsAPI).toHaveBeenLastCalledWith(1, expect.objectContaining({ name: 'Victor' }))
    })

    it('busca de inmediato al enviar el formulario y combina los filtros normalizados', async () => {
        vi.mocked(getVisitsAPI).mockResolvedValue(currentList)
        renderView(createClient())
        await screen.findAllByText('Visitante pendiente')

        fireEvent.change(screen.getByLabelText('Nombre del visitante'), { target: { value: '  Victor   Perez  ' } })
        fireEvent.change(screen.getByLabelText('DPI'), { target: { value: '1234 56789 0101' } })
        fireEvent.change(screen.getByLabelText('Empresa'), { target: { value: '  Empresa   Uno  ' } })
        fireEvent.submit(screen.getByRole('search'))

        await waitFor(() => expect(getVisitsAPI).toHaveBeenLastCalledWith(1, expect.objectContaining({
            name: 'Victor Perez', document_number: '1234567890101', company_name: 'Empresa Uno',
        })))
        const calls = vi.mocked(getVisitsAPI).mock.calls.length
        await act(async () => { await vi.advanceTimersByTimeAsync(450) })
        expect(getVisitsAPI).toHaveBeenCalledTimes(calls)
    })

    it('busca unicamente en el dia seleccionado conservando el nombre y permite volver a hoy', async () => {
        vi.mocked(getVisitsAPI).mockResolvedValue({ visits: [], lastPage: 0, total: 0 })
        renderView(createClient())
        await screen.findByText('No hay visitas registradas para esta fecha')
        const date = screen.getByLabelText('Fecha de la visita') as HTMLInputElement
        const today = date.value
        const otherDate = today === '2026-01-15' ? '2026-01-14' : '2026-01-15'
        expect(screen.queryByText('Todas las fechas')).not.toBeInTheDocument()
        expect(screen.queryByText('La búsqueda es automática. Presiona Enter para buscar de inmediato.')).not.toBeInTheDocument()
        fireEvent.change(screen.getByLabelText('Nombre del visitante'), { target: { value: 'Victor' } })
        fireEvent.submit(screen.getByRole('search'))
        await screen.findByText('No encontramos visitas con estos filtros')

        vi.mocked(getVisitsAPI).mockResolvedValue({ ...currentList, total: 21, lastPage: 3 })
        expect(screen.queryByRole('button', { name: 'Buscar en todas las fechas' })).not.toBeInTheDocument()
        fireEvent.change(date, { target: { value: otherDate } })
        await screen.findAllByText('Visitante pendiente')
        expect(getVisitsAPI).toHaveBeenLastCalledWith(1, expect.objectContaining({
            date: otherDate, name: 'Victor', exclude_status: 'FINALIZADA',
        }))
        expect(screen.getByRole('status')).toHaveTextContent(`21 visitas encontradas el ${otherDate.split('-').reverse().join('/')} con los filtros aplicados.`)

        fireEvent.click(screen.getByRole('button', { name: 'Limpiar filtros' }))
        await waitFor(() => expect(getVisitsAPI).toHaveBeenLastCalledWith(1, expect.objectContaining({
            date: today, name: undefined, document_number: undefined, company_name: undefined,
        })))
        expect(screen.getByLabelText('Nombre del visitante')).toHaveValue('')
        expect(date).toHaveValue(today)
        fireEvent.change(date, { target: { value: '' } })
        expect(date).toHaveValue(today)
        expect(vi.mocked(getVisitsAPI).mock.calls.every(([, filters]) => Boolean(filters?.date))).toBe(true)
    })

    it('vuelve a la primera pagina al cambiar un filtro', async () => {
        vi.mocked(getVisitsAPI).mockResolvedValue({ ...currentList, lastPage: 3, total: 21 })
        renderView(createClient())
        await screen.findAllByText('Visitante pendiente')
        fireEvent.click(screen.getByRole('button', { name: '2' }))
        await waitFor(() => expect(getVisitsAPI).toHaveBeenLastCalledWith(2, expect.anything()))

        fireEvent.change(screen.getByLabelText('Empresa'), { target: { value: 'Empresa' } })
        await act(async () => { await vi.advanceTimersByTimeAsync(450) })
        expect(getVisitsAPI).toHaveBeenLastCalledWith(1, expect.objectContaining({ company_name: 'Empresa' }))
    })

    it('limpia un campo manteniendo el foco y permite usar Escape', async () => {
        vi.mocked(getVisitsAPI).mockResolvedValue(currentList)
        renderView(createClient())
        await screen.findAllByText('Visitante pendiente')
        const input = screen.getByLabelText('Nombre del visitante')
        fireEvent.change(input, { target: { value: 'Victor' } })
        fireEvent.click(screen.getByRole('button', { name: 'Limpiar nombre del visitante' }))
        expect(input).toHaveValue('')
        expect(input).toHaveFocus()

        fireEvent.change(input, { target: { value: 'Victor' } })
        fireEvent.keyDown(input, { key: 'Escape' })
        expect(input).toHaveValue('')
        expect(input).toHaveFocus()
    })

    it('permite reintentar una busqueda fallida sin cambiar los filtros', async () => {
        vi.mocked(getVisitsAPI).mockRejectedValueOnce(new Error('Sin conexion')).mockResolvedValue(currentList)
        renderView(createClient())
        await screen.findByRole('alert')
        fireEvent.click(screen.getByRole('button', { name: 'Reintentar búsqueda' }))
        await screen.findAllByText('Visitante pendiente')
        expect(getVisitsAPI).toHaveBeenCalledTimes(2)
        expect(vi.mocked(getVisitsAPI).mock.calls[1]).toEqual(vi.mocked(getVisitsAPI).mock.calls[0])
    })
})

describe('vigencia del estado de las visitas', () => {
    it.each([
        ['Buscar por nombre...', 'name', 'V', 'Victor'],
        ['Buscar por DPI...', 'document_number', '1', '1234567890101'],
        ['Buscar por empresa...', 'company_name', 'E', 'Empresa'],
    ])('permite seguir escribiendo en %s mientras se consulta el filtro', async (placeholder, field, firstCharacter, search) => {
        let completeFirstSearch!: (value: typeof currentList) => void
        let completeSearch!: (value: typeof currentList) => void
        vi.mocked(getVisitsAPI)
            .mockResolvedValueOnce(currentList)
            .mockImplementationOnce(() => new Promise(resolve => { completeFirstSearch = resolve }))
            .mockImplementationOnce(() => new Promise(resolve => { completeSearch = resolve }))
        renderView(createClient())
        await screen.findAllByText('Visitante pendiente')

        const input = screen.getByPlaceholderText(placeholder)
        input.focus()
        fireEvent.change(input, { target: { value: firstCharacter } })
        await act(async () => { await vi.advanceTimersByTimeAsync(450) })

        expect(getVisitsAPI).toHaveBeenLastCalledWith(1, expect.objectContaining({ [field]: firstCharacter }))
        expect(screen.getByRole('status')).toHaveTextContent('Buscando visitas...')
        expect(screen.getByPlaceholderText(placeholder)).toBe(input)
        expect(input).toHaveFocus()

        fireEvent.change(input, { target: { value: search } })
        await act(async () => { await vi.advanceTimersByTimeAsync(450) })
        expect(getVisitsAPI).toHaveBeenLastCalledWith(1, expect.objectContaining({ [field]: search }))
        expect(input).toHaveValue(search)
        expect(input).toHaveFocus()

        const result = { visits: [{ ...scheduledVisit, company_person: { id: 3, name: 'Resultado actual', document_number: '789' } }], lastPage: 1, total: 1 }
        await act(async () => { completeSearch(result) })
        expect((await screen.findAllByText('Resultado actual')).length).toBeGreaterThan(0)
        expect(input).toHaveFocus()

        await act(async () => { completeFirstSearch(currentList) })
        expect(screen.queryByText('Visitante pendiente')).not.toBeInTheDocument()
        expect(input).toHaveValue(search)
    })

    it('mantiene el buscador disponible si falla una consulta y permite buscar de nuevo', async () => {
        vi.mocked(getVisitsAPI)
            .mockResolvedValueOnce(currentList)
            .mockRejectedValueOnce(new Error('Sin conexion'))
            .mockResolvedValue(currentList)
        renderView(createClient())
        await screen.findAllByText('Visitante pendiente')

        const input = screen.getByPlaceholderText('Buscar por nombre...')
        input.focus()
        fireEvent.change(input, { target: { value: 'V' } })
        await act(async () => { await vi.advanceTimersByTimeAsync(450) })
        expect(await screen.findByRole('alert')).toHaveTextContent('Error al cargar las visitas.')
        expect(input).toHaveFocus()

        fireEvent.change(input, { target: { value: 'Victor' } })
        await act(async () => { await vi.advanceTimersByTimeAsync(450) })
        await screen.findAllByText('Visitante pendiente')
        expect(screen.queryByRole('alert')).not.toBeInTheDocument()
        expect(input).toHaveValue('Victor')
        expect(input).toHaveFocus()
    })

    it('consulta de nuevo al entrar y oculta la lista guardada hasta recibir la respuesta', async () => {
        const client = createClient()
        const today = new Intl.DateTimeFormat('en-CA', {
            timeZone: 'America/Guatemala', year: 'numeric', month: '2-digit', day: '2-digit',
        }).format(new Date())
        client.setQueryData(['visits', today, 1, { name: '', document_number: '', company_name: '' }], {
            visits: [activeVisit], lastPage: 1, total: 1,
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
            .mockResolvedValueOnce({ visits: [activeVisit], lastPage: 1, total: 1 })
            .mockResolvedValue(currentList)
        renderView(createClient())
        expect((await screen.findAllByText('EN PLANTA')).length).toBeGreaterThan(0)

        await act(async () => { await vi.advanceTimersByTimeAsync(15_000) })

        expect((await screen.findAllByText('PROGRAMADA')).length).toBeGreaterThan(0)
        expect(screen.queryByText('EN PLANTA')).not.toBeInTheDocument()
    })

    it.each(['focus', 'reconnect'])('actualiza al recuperar %s', async event => {
        vi.mocked(getVisitsAPI)
            .mockResolvedValueOnce({ visits: [activeVisit], lastPage: 1, total: 1 })
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

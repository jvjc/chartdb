import { Diagram, diagramSchema } from '@/lib/domain/diagram';
import { API_BASE_URL } from '@/lib/env';

const STORAGE_KEY = 'chartdb_mock_diagrams';
const useMock = API_BASE_URL === '';

const saveDiagram = async (diagram: Diagram): Promise<void> => {
    if (useMock) {
        const diagrams: Record<string, Diagram> = JSON.parse(
            localStorage.getItem(STORAGE_KEY) || '{}'
        );
        diagrams[diagram.id] = diagram;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(diagrams));
        return;
    }

    await fetch(`${API_BASE_URL}/diagrams/${diagram.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(diagram),
    });
};

const getDiagram = async (id: string): Promise<Diagram | undefined> => {
    if (useMock) {
        const diagrams: Record<string, Diagram> = JSON.parse(
            localStorage.getItem(STORAGE_KEY) || '{}'
        );
        const data = diagrams[id];
        if (!data) {
            return undefined;
        }
        return diagramSchema.parse({
            ...data,
            createdAt: new Date(data.createdAt),
            updatedAt: new Date(data.updatedAt),
        });
    }

    const response = await fetch(`${API_BASE_URL}/diagrams/${id}`);
    if (!response.ok) {
        return undefined;
    }
    const data = await response.json();
    return diagramSchema.parse({
        ...data,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
    });
};

export { saveDiagram, getDiagram };

import React, { useEffect, useState } from 'react';
import { useStorage } from '@/hooks/use-storage';
import { LocalConfigProvider } from '@/context/local-config-context/local-config-provider';
import { StorageProvider } from '@/context/storage-context/storage-provider';
import { ThemeProvider } from '@/context/theme-context/theme-provider';
import type { Diagram } from '@/lib/domain/diagram';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const DiagramsPageComponent: React.FC = () => {
    const { listDiagrams } = useStorage();
    const [diagrams, setDiagrams] = useState<Diagram[]>([]);

    useEffect(() => {
        listDiagrams().then(setDiagrams);
    }, [listDiagrams]);

    return (
        <div className="flex flex-col p-4">
            <Helmet>
                <title>My diagrams</title>
            </Helmet>
            <h1 className="mb-4 text-2xl font-bold">My diagrams</h1>
            <ul className="list-disc pl-4">
                {diagrams.map((diagram) => (
                    <li key={diagram.id} className="mb-1">
                        <Link className="text-blue-600 underline" to={`/diagrams/${diagram.id}`}>
                            {diagram.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export const DiagramsPage: React.FC = () => (
    <LocalConfigProvider>
        <StorageProvider>
            <ThemeProvider>
                <DiagramsPageComponent />
            </ThemeProvider>
        </StorageProvider>
    </LocalConfigProvider>
);

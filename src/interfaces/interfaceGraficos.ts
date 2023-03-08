export interface graficoBarraDataSetsProps {
    label: string;
    data: number[];
    backgroundColor: string;
}

export interface graficoLinhaDataSetsProps {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
}

export interface graficoRoscaDataSetsProps {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderWidth: number;
    hoverOffset: number;
}
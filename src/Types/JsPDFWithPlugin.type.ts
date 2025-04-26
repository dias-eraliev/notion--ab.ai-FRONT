import jsPDF from "jspdf";

export type JsPDFWithPluginType = jsPDF & {
    autoTable: (options: any) => void;
};

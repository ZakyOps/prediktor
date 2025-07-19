import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { GeneratedBusinessPlan } from './business-plan';

export class PDFExportService {
  async exportBusinessPlanToPDF(businessPlan: GeneratedBusinessPlan): Promise<void> {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let currentY = margin;

    // Configuration des styles
    pdf.setFont('helvetica');
    
    // Page de titre
    this.addTitlePage(pdf, businessPlan);
    pdf.addPage();

    // Table des matières
    this.addTableOfContents(pdf, businessPlan);
    pdf.addPage();

    // Contenu principal
    await this.addExecutiveSummary(pdf, businessPlan, currentY);
    pdf.addPage();

    await this.addCompanyDescription(pdf, businessPlan, margin);
    pdf.addPage();

    await this.addMarketAnalysis(pdf, businessPlan, margin);
    pdf.addPage();

    await this.addOrganization(pdf, businessPlan, margin);
    pdf.addPage();

    await this.addProductsServices(pdf, businessPlan, margin);
    pdf.addPage();

    await this.addMarketingSales(pdf, businessPlan, margin);
    pdf.addPage();

    await this.addFinancialProjections(pdf, businessPlan, margin);
    pdf.addPage();

    await this.addFunding(pdf, businessPlan, margin);

    // Sauvegarde du PDF
    const fileName = `Business_Plan_${businessPlan.metadata.companyName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
  }

  private addTitlePage(pdf: jsPDF, businessPlan: GeneratedBusinessPlan): void {
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Titre principal
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('BUSINESS PLAN', pageWidth / 2, 80, { align: 'center' });

    // Nom de l'entreprise
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'normal');
    pdf.text(businessPlan.metadata.companyName, pageWidth / 2, 100, { align: 'center' });

    // Secteur d'activité
    pdf.setFontSize(14);
    pdf.text(businessPlan.metadata.industry, pageWidth / 2, 115, { align: 'center' });

    // Date de génération
    pdf.setFontSize(12);
    pdf.text(`Généré le ${new Date(businessPlan.metadata.generatedAt).toLocaleDateString('fr-FR')}`, pageWidth / 2, 140, { align: 'center' });

    // Informations de contact (placeholder)
    pdf.setFontSize(10);
    pdf.text('Contact: contact@entreprise.com', pageWidth / 2, 160, { align: 'center' });
    pdf.text('Téléphone: +225 XX XX XX XX', pageWidth / 2, 170, { align: 'center' });

    // Footer
    pdf.setFontSize(8);
    pdf.text('Document généré par Prediktor - Plateforme d\'analyse sectorielle', pageWidth / 2, pageHeight - 20, { align: 'center' });
  }

  private addTableOfContents(pdf: jsPDF, businessPlan: GeneratedBusinessPlan): void {
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    let currentY = margin + 20;

    // Titre
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('TABLE DES MATIÈRES', margin, currentY);
    currentY += 20;

    // Sections
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');

    const sections = [
      { title: 'Résumé Exécutif', page: 3 },
      { title: 'Description de l\'Entreprise', page: 4 },
      { title: 'Analyse de Marché', page: 5 },
      { title: 'Organisation et Management', page: 6 },
      { title: 'Produits et Services', page: 7 },
      { title: 'Marketing et Ventes', page: 8 },
      { title: 'Projections Financières', page: 9 },
      { title: 'Financement Requis', page: 10 }
    ];

    sections.forEach(section => {
      pdf.text(section.title, margin, currentY);
      pdf.text(section.page.toString(), pageWidth - margin - 10, currentY, { align: 'right' });
      currentY += 8;
    });
  }

  private async addExecutiveSummary(pdf: jsPDF, businessPlan: GeneratedBusinessPlan, startY: number): Promise<void> {
    const margin = 20;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const contentWidth = pageWidth - (margin * 2);
    let currentY = startY;

    // Titre de section
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('RÉSUMÉ EXÉCUTIF', margin, currentY);
    currentY += 15;

    // Contenu principal
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    
    const content = businessPlan.executiveSummary.content;
    const lines = this.splitTextToFit(content, contentWidth, pdf);
    
    lines.forEach(line => {
      if (currentY > 270) {
        pdf.addPage();
        currentY = margin;
      }
      pdf.text(line, margin, currentY);
      currentY += 6;
    });

    // Sous-sections
    if (businessPlan.executiveSummary.subsections) {
      currentY += 10;
      
      businessPlan.executiveSummary.subsections.forEach(subsection => {
        if (currentY > 250) {
          pdf.addPage();
          currentY = margin;
        }

        // Titre de sous-section
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text(subsection.title, margin, currentY);
        currentY += 8;

        // Contenu de sous-section
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        
        const subLines = this.splitTextToFit(subsection.content, contentWidth, pdf);
        subLines.forEach(line => {
          if (currentY > 270) {
            pdf.addPage();
            currentY = margin;
          }
          pdf.text(line, margin + 5, currentY);
          currentY += 5;
        });
        
        currentY += 5;
      });
    }
  }

  private async addCompanyDescription(pdf: jsPDF, businessPlan: GeneratedBusinessPlan, startY: number): Promise<void> {
    await this.addSection(pdf, businessPlan.companyDescription, 'DESCRIPTION DE L\'ENTREPRISE', startY);
  }

  private async addMarketAnalysis(pdf: jsPDF, businessPlan: GeneratedBusinessPlan, startY: number): Promise<void> {
    await this.addSection(pdf, businessPlan.marketAnalysis, 'ANALYSE DE MARCHÉ', startY);
  }

  private async addOrganization(pdf: jsPDF, businessPlan: GeneratedBusinessPlan, startY: number): Promise<void> {
    await this.addSection(pdf, businessPlan.organization, 'ORGANISATION ET MANAGEMENT', startY);
  }

  private async addProductsServices(pdf: jsPDF, businessPlan: GeneratedBusinessPlan, startY: number): Promise<void> {
    await this.addSection(pdf, businessPlan.productsServices, 'PRODUITS ET SERVICES', startY);
  }

  private async addMarketingSales(pdf: jsPDF, businessPlan: GeneratedBusinessPlan, startY: number): Promise<void> {
    await this.addSection(pdf, businessPlan.marketingSales, 'MARKETING ET VENTES', startY);
  }

  private async addFinancialProjections(pdf: jsPDF, businessPlan: GeneratedBusinessPlan, startY: number): Promise<void> {
    await this.addSection(pdf, businessPlan.financialProjections, 'PROJECTIONS FINANCIÈRES', startY);
  }

  private async addFunding(pdf: jsPDF, businessPlan: GeneratedBusinessPlan, startY: number): Promise<void> {
    await this.addSection(pdf, businessPlan.funding, 'FINANCEMENT REQUIS', startY);
  }

  private async addSection(pdf: jsPDF, section: any, sectionTitle: string, startY: number): Promise<void> {
    const margin = 20;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const contentWidth = pageWidth - (margin * 2);
    let currentY = startY;

    // Titre de section
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text(sectionTitle, margin, currentY);
    currentY += 15;

    // Contenu principal
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    
    const content = section.content;
    const lines = this.splitTextToFit(content, contentWidth, pdf);
    
    lines.forEach(line => {
      if (currentY > 270) {
        pdf.addPage();
        currentY = margin;
      }
      pdf.text(line, margin, currentY);
      currentY += 6;
    });

    // Sous-sections
    if (section.subsections) {
      currentY += 10;
      
      section.subsections.forEach((subsection: any) => {
        if (currentY > 250) {
          pdf.addPage();
          currentY = margin;
        }

        // Titre de sous-section
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text(subsection.title, margin, currentY);
        currentY += 8;

        // Contenu de sous-section
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        
        const subLines = this.splitTextToFit(subsection.content, contentWidth, pdf);
        subLines.forEach(line => {
          if (currentY > 270) {
            pdf.addPage();
            currentY = margin;
          }
          pdf.text(line, margin + 5, currentY);
          currentY += 5;
        });
        
        currentY += 5;
      });
    }
  }

  private splitTextToFit(text: string, maxWidth: number, pdf: jsPDF): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    words.forEach(word => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = pdf.getTextWidth(testLine);
      
      if (testWidth > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  }

  // Méthode alternative pour générer PDF à partir d'un élément HTML
  async exportFromHTML(elementId: string, fileName: string): Promise<void> {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id ${elementId} not found`);
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(fileName);
  }
}

export default PDFExportService; 
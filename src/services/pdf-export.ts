import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { GeneratedBusinessPlan } from './business-plan';
import { ComparativeAnalysis } from './gemini';

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

  // Méthode pour exporter l'analyse sectorielle au format PDF
  async exportSectorAnalysisToPDF(analysis: ComparativeAnalysis, companyData: any): Promise<void> {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let currentY = margin;

    // Configuration des styles
    pdf.setFont('helvetica');
    
    // Page de titre
    this.addSectorAnalysisTitlePage(pdf, analysis, companyData);
    pdf.addPage();

    // Table des matières
    this.addSectorAnalysisTableOfContents(pdf);
    pdf.addPage();

    // Résumé exécutif
    await this.addSectorAnalysisExecutiveSummary(pdf, analysis, margin);
    pdf.addPage();

    // Score de santé et position concurrentielle
    await this.addHealthScoreSection(pdf, analysis, margin);
    pdf.addPage();

    // Analyse comparative avec graphiques
    await this.addComparativeAnalysisSection(pdf, analysis, margin);
    pdf.addPage();

    // Graphiques visuels capturés depuis l'interface
    const chartsCaptured = await this.addVisualChartsSection(pdf, margin, analysis);
    pdf.addPage();

    // Si les graphiques n'ont pas été capturés, ajouter une section avec les données textuelles
    if (!chartsCaptured) {
      await this.addChartsSection(pdf, analysis, margin);
      pdf.addPage();
    }

    // Recommandations
    await this.addRecommendationsSection(pdf, analysis, margin);
    pdf.addPage();

    // Tendances du secteur
    await this.addSectorTrendsSection(pdf, analysis, margin);

    // Sauvegarde du PDF
    const fileName = `Analyse_Sectorielle_${companyData.sector.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
  }

  private addSectorAnalysisTitlePage(pdf: jsPDF, analysis: ComparativeAnalysis, companyData: any): void {
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Titre principal
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('ANALYSE SECTORIELLE', pageWidth / 2, 80, { align: 'center' });

    // Nom de l'entreprise
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'normal');
    pdf.text(companyData.sector, pageWidth / 2, 100, { align: 'center' });

    // Score de santé
    pdf.setFontSize(14);
    pdf.text(`Score de Santé: ${analysis.healthScore.overall}/100`, pageWidth / 2, 115, { align: 'center' });

    // Position concurrentielle
    pdf.text(`Position: ${analysis.competitivePosition.position.toUpperCase()}`, pageWidth / 2, 130, { align: 'center' });

    // Date de génération
    pdf.setFontSize(12);
    pdf.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, pageWidth / 2, 155, { align: 'center' });

    // Footer
    pdf.setFontSize(8);
    pdf.text('Document généré par Prediktor - Plateforme d\'analyse sectorielle', pageWidth / 2, pageHeight - 20, { align: 'center' });
  }

  private addSectorAnalysisTableOfContents(pdf: jsPDF): void {
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
      { title: 'Score de Santé et Position Concurrentielle', page: 4 },
      { title: 'Analyse Comparative', page: 5 },
      { title: 'Graphiques et Visualisations', page: 6 },
      { title: 'Recommandations Stratégiques', page: 7 },
      { title: 'Tendances du Secteur', page: 8 }
    ];

    sections.forEach(section => {
      pdf.text(section.title, margin, currentY);
      pdf.text(section.page.toString(), pageWidth - margin - 10, currentY, { align: 'right' });
      currentY += 8;
    });
  }

  private async addSectorAnalysisExecutiveSummary(pdf: jsPDF, analysis: ComparativeAnalysis, startY: number): Promise<void> {
    const margin = 20;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const contentWidth = pageWidth - (margin * 2);
    let currentY = startY;

    // Titre de section
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('RÉSUMÉ EXÉCUTIF', margin, currentY);
    currentY += 15;

    // Score de santé global
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Score de Santé Global: ${analysis.healthScore.overall}/100`, margin, currentY);
    currentY += 10;

    // Description du score
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    const scoreDescription = analysis.healthScore.overall >= 80 ? 'Excellent' : 
                           analysis.healthScore.overall >= 60 ? 'Bon' : 
                           analysis.healthScore.overall >= 40 ? 'Moyen' : 'À améliorer';
    pdf.text(`Évaluation: ${scoreDescription}`, margin, currentY);
    currentY += 15;

    // Position concurrentielle
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Position Concurrentielle: ${analysis.competitivePosition.position.toUpperCase()}`, margin, currentY);
    currentY += 10;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Score: ${analysis.competitivePosition.score}/100`, margin, currentY);
    currentY += 8;

    const descriptionLines = this.splitTextToFit(analysis.competitivePosition.description, contentWidth, pdf);
    descriptionLines.forEach(line => {
      if (currentY > 270) {
        pdf.addPage();
        currentY = margin;
      }
      pdf.text(line, margin, currentY);
      currentY += 5;
    });

    currentY += 10;

    // Forces et faiblesses
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Forces Principales:', margin, currentY);
    currentY += 8;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    analysis.healthScore.details.strengths.forEach(strength => {
      if (currentY > 270) {
        pdf.addPage();
        currentY = margin;
      }
      pdf.text(`• ${strength}`, margin + 5, currentY);
      currentY += 5;
    });

    currentY += 8;

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Faiblesses à Améliorer:', margin, currentY);
    currentY += 8;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    analysis.healthScore.details.weaknesses.forEach(weakness => {
      if (currentY > 270) {
        pdf.addPage();
        currentY = margin;
      }
      pdf.text(`• ${weakness}`, margin + 5, currentY);
      currentY += 5;
    });
  }

  private async addHealthScoreSection(pdf: jsPDF, analysis: ComparativeAnalysis, startY: number): Promise<void> {
    const margin = 20;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const contentWidth = pageWidth - (margin * 2);
    let currentY = startY;

    // Titre de section
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('SCORE DE SANTÉ ET POSITION CONCURRENTIELLE', margin, currentY);
    currentY += 15;

    // Score de santé détaillé
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Score de Santé Détaillé:', margin, currentY);
    currentY += 10;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`• Rentabilité: ${analysis.healthScore.profitability}/100`, margin, currentY);
    currentY += 6;
    pdf.text(`• Efficacité: ${analysis.healthScore.efficiency}/100`, margin, currentY);
    currentY += 6;
    pdf.text(`• Croissance: ${analysis.healthScore.growth}/100`, margin, currentY);
    currentY += 6;
    pdf.text(`• Position Marché: ${analysis.healthScore.marketPosition}/100`, margin, currentY);
    currentY += 15;

    // Position concurrentielle
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Position Concurrentielle:', margin, currentY);
    currentY += 10;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    const positionLines = this.splitTextToFit(analysis.competitivePosition.description, contentWidth, pdf);
    positionLines.forEach(line => {
      if (currentY > 270) {
        pdf.addPage();
        currentY = margin;
      }
      pdf.text(line, margin, currentY);
      currentY += 5;
    });
  }

  private async addComparativeAnalysisSection(pdf: jsPDF, analysis: ComparativeAnalysis, startY: number): Promise<void> {
    const margin = 20;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const contentWidth = pageWidth - (margin * 2);
    let currentY = startY;

    // Titre de section
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('ANALYSE COMPARATIVE', margin, currentY);
    currentY += 15;

    // Données sectorielles
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Données Sectorielles:', margin, currentY);
    currentY += 10;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`• Secteur: ${analysis.sectorData.sector}`, margin, currentY);
    currentY += 6;
    pdf.text(`• Croissance du secteur: ${analysis.sectorData.growthRate}%`, margin, currentY);
    currentY += 6;
    pdf.text(`• Taille du marché: ${analysis.sectorData.marketSize.toLocaleString()} FCFA`, margin, currentY);
    currentY += 6;
    pdf.text(`• Revenus moyens: ${analysis.sectorData.averageRevenue.toLocaleString()} FCFA`, margin, currentY);
    currentY += 6;
    pdf.text(`• Employés moyens: ${analysis.sectorData.averageEmployees}`, margin, currentY);
    currentY += 15;

    // Métriques clés
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Métriques Clés du Secteur:', margin, currentY);
    currentY += 10;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`• Rentabilité sectorielle: ${analysis.sectorData.keyMetrics.profitability}%`, margin, currentY);
    currentY += 6;
    pdf.text(`• Efficacité sectorielle: ${analysis.sectorData.keyMetrics.efficiency}%`, margin, currentY);
    currentY += 6;
    pdf.text(`• Part de marché moyenne: ${analysis.sectorData.keyMetrics.marketShare}%`, margin, currentY);
    currentY += 15;

    // Comparaison avec le secteur
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Comparaison avec le Secteur:', margin, currentY);
    currentY += 10;

    const profitabilityGap = analysis.healthScore.profitability - analysis.sectorData.keyMetrics.profitability;
    const efficiencyGap = analysis.healthScore.efficiency - analysis.sectorData.keyMetrics.efficiency;
    const growthGap = analysis.healthScore.growth - analysis.sectorData.growthRate;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`• Avantage rentabilité: ${profitabilityGap > 0 ? '+' : ''}${profitabilityGap.toFixed(1)} points`, margin, currentY);
    currentY += 6;
    pdf.text(`• Avantage efficacité: ${efficiencyGap > 0 ? '+' : ''}${efficiencyGap.toFixed(1)} points`, margin, currentY);
    currentY += 6;
    pdf.text(`• Avantage croissance: ${growthGap > 0 ? '+' : ''}${growthGap.toFixed(1)} points`, margin, currentY);
  }

  private async addRecommendationsSection(pdf: jsPDF, analysis: ComparativeAnalysis, startY: number): Promise<void> {
    const margin = 20;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const contentWidth = pageWidth - (margin * 2);
    let currentY = startY;

    // Titre de section
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('RECOMMANDATIONS STRATÉGIQUES', margin, currentY);
    currentY += 15;

    // Actions immédiates
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Actions Immédiates (1-3 mois):', margin, currentY);
    currentY += 10;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    analysis.recommendations.immediate.forEach((action, index) => {
      if (currentY > 270) {
        pdf.addPage();
        currentY = margin;
      }
      pdf.text(`${index + 1}. ${action}`, margin, currentY);
      currentY += 6;
    });

    currentY += 10;

    // Actions court terme
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Actions Court Terme (3-6 mois):', margin, currentY);
    currentY += 10;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    analysis.recommendations.shortTerm.forEach((action, index) => {
      if (currentY > 270) {
        pdf.addPage();
        currentY = margin;
      }
      pdf.text(`${index + 1}. ${action}`, margin, currentY);
      currentY += 6;
    });

    currentY += 10;

    // Actions long terme
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Actions Long Terme (6-12 mois):', margin, currentY);
    currentY += 10;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    analysis.recommendations.longTerm.forEach((action, index) => {
      if (currentY > 270) {
        pdf.addPage();
        currentY = margin;
      }
      pdf.text(`${index + 1}. ${action}`, margin, currentY);
      currentY += 6;
    });
  }

  private async addVisualChartsSection(pdf: jsPDF, startY: number, analysis: ComparativeAnalysis): Promise<boolean> {
    const margin = 20;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let currentY = startY;

    // Titre de section
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('GRAPHIQUES ET VISUALISATIONS', margin, currentY);
    currentY += 20;

    try {
      // Attendre un peu pour que les graphiques soient rendus
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Essayer plusieurs stratégies de capture
      let captured = false;

      // Stratégie 1: Capturer tous les graphiques Recharts de tous les onglets
      const allRechartsElements = document.querySelectorAll('.recharts-wrapper');
      console.log('Total Recharts elements found:', allRechartsElements.length);

      if (allRechartsElements.length > 0) {
        // Activer chaque onglet pour capturer ses graphiques
        const tabs = ['comparison', 'charts'];
        
        for (const tabValue of tabs) {
          const tab = document.querySelector(`[value="${tabValue}"]`) as HTMLElement;
          if (tab) {
            tab.click();
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Capturer les graphiques de cet onglet
            const tabRechartsElements = document.querySelectorAll('.recharts-wrapper');
            console.log(`Recharts elements in ${tabValue} tab:`, tabRechartsElements.length);
            
            for (let i = 0; i < tabRechartsElements.length; i++) {
              const chartElement = tabRechartsElements[i];
              console.log(`Capturing chart element from ${tabValue}:`, chartElement);
              
              try {
                const canvas = await html2canvas(chartElement as HTMLElement, {
                  scale: 1.5,
                  useCORS: true,
                  allowTaint: true,
                  backgroundColor: '#ffffff',
                  logging: true,
                  width: chartElement.clientWidth,
                  height: chartElement.clientHeight
                });

                const imgData = canvas.toDataURL('image/png');
                const imgWidth = pageWidth - (margin * 2);
                const imgHeight = (canvas.height * imgWidth) / canvas.width;

                if (currentY + imgHeight > pageHeight - margin) {
                  pdf.addPage();
                  currentY = margin;
                }

                pdf.addImage(imgData, 'PNG', margin, currentY, imgWidth, imgHeight);
                currentY += imgHeight + 20;
                captured = true;
                console.log(`Chart from ${tabValue} captured successfully`);
              } catch (chartError) {
                console.error(`Error capturing chart from ${tabValue}:`, chartError);
              }
            }
          }
        }
      }

      // Si la capture échoue, générer des graphiques simples directement dans le PDF
      if (!captured) {
        console.log('Generating simple charts in PDF');
        captured = await this.generateSimpleChartsInPDF(pdf, margin, currentY, analysis);
      }

      return captured;

    } catch (error) {
      console.error('Erreur lors de la capture des graphiques:', error);
      
      // Fallback: générer des graphiques simples
      try {
        await this.generateSimpleChartsInPDF(pdf, margin, currentY, analysis);
        return true;
      } catch (fallbackError) {
        console.error('Erreur lors de la génération des graphiques de fallback:', fallbackError);
        return false;
      }
    }
  }

  private async generateSimpleChartsInPDF(pdf: jsPDF, margin: number, startY: number, analysis: ComparativeAnalysis): Promise<boolean> {
    let currentY = startY;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const contentWidth = pageWidth - (margin * 2);

    try {
      // Vérifier que l'analyse contient les données nécessaires
      if (!analysis || !analysis.charts) {
        return false;
      }

      // Graphique 1: Comparaison des Métriques
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Comparaison des Métriques', margin, currentY);
      currentY += 15;

      // Créer un graphique en barres simple
      const metricsData = analysis.charts.marketPosition;
      const chartWidth = contentWidth * 0.8;
      const chartHeight = 80;
      const chartX = margin + (contentWidth - chartWidth) / 2;
      const chartY = currentY;

      // Dessiner le cadre du graphique
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.5);
      pdf.rect(chartX, chartY, chartWidth, chartHeight);

      // Dessiner les barres
      const barWidth = chartWidth / (metricsData.length * 3); // 3 barres par métrique (entreprise, secteur, espace)
      const maxValue = Math.max(...metricsData.map(item => Math.max(item.company, item.sector)));

      metricsData.forEach((item, index) => {
        const x = chartX + index * (chartWidth / metricsData.length) + barWidth;
        
        // Barre entreprise (bleue)
        const companyHeight = (item.company / maxValue) * (chartHeight - 20);
        pdf.setFillColor(37, 99, 235); // Bleu
        pdf.rect(x, chartY + chartHeight - companyHeight - 10, barWidth, companyHeight, 'F');
        
        // Barre secteur (verte)
        const sectorHeight = (item.sector / maxValue) * (chartHeight - 20);
        pdf.setFillColor(5, 150, 105); // Vert
        pdf.rect(x + barWidth + 2, chartY + chartHeight - sectorHeight - 10, barWidth, sectorHeight, 'F');
        
        // Label
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.text(item.metric.substring(0, 8), x, chartY + chartHeight + 5);
      });

      // Légende
      currentY += chartHeight + 25;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setFillColor(37, 99, 235);
      pdf.rect(margin, currentY, 5, 5, 'F');
      pdf.text('Votre entreprise', margin + 10, currentY + 4);
      
      pdf.setFillColor(5, 150, 105);
      pdf.rect(margin + 80, currentY, 5, 5, 'F');
      pdf.text('Secteur', margin + 90, currentY + 4);

      currentY += 20;

      // Graphique 2: Comparaison des Revenus
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Comparaison des Revenus', margin, currentY);
      currentY += 15;

      const revenueData = analysis.charts.revenueComparison;
      const revenueChartWidth = contentWidth * 0.8;
      const revenueChartHeight = 80;
      const revenueChartX = margin + (contentWidth - revenueChartWidth) / 2;
      const revenueChartY = currentY;

      // Dessiner le cadre du graphique
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.5);
      pdf.rect(revenueChartX, revenueChartY, revenueChartWidth, revenueChartHeight);

      // Dessiner les barres
      const revenueBarWidth = revenueChartWidth / (revenueData.length * 3);
      const maxRevenue = Math.max(...revenueData.map(item => Math.max(item.company, item.sector)));

      revenueData.forEach((item, index) => {
        const x = revenueChartX + index * (revenueChartWidth / revenueData.length) + revenueBarWidth;
        
        // Barre entreprise (bleue)
        const companyHeight = (item.company / maxRevenue) * (revenueChartHeight - 20);
        pdf.setFillColor(37, 99, 235);
        pdf.rect(x, revenueChartY + revenueChartHeight - companyHeight - 10, revenueBarWidth, companyHeight, 'F');
        
        // Barre secteur (verte)
        const sectorHeight = (item.sector / maxRevenue) * (revenueChartHeight - 20);
        pdf.setFillColor(5, 150, 105);
        pdf.rect(x + revenueBarWidth + 2, revenueChartY + revenueChartHeight - sectorHeight - 10, revenueBarWidth, sectorHeight, 'F');
        
        // Label
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.text(item.label.substring(0, 8), x, revenueChartY + revenueChartHeight + 5);
      });

      // Légende
      currentY += revenueChartHeight + 25;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setFillColor(37, 99, 235);
      pdf.rect(margin, currentY, 5, 5, 'F');
      pdf.text('Votre entreprise', margin + 10, currentY + 4);
      
      pdf.setFillColor(5, 150, 105);
      pdf.rect(margin + 80, currentY, 5, 5, 'F');
      pdf.text('Secteur', margin + 90, currentY + 4);

      currentY += 30;

      // Graphique 3: Score de Santé Détaillé (Graphique circulaire)
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Score de Santé Détaillé', margin, currentY);
      currentY += 15;

      // Créer un graphique circulaire simple
      const healthData = [
        { name: 'Rentabilité', value: analysis.healthScore.profitability, color: [37, 99, 235] }, // Bleu
        { name: 'Efficacité', value: analysis.healthScore.efficiency, color: [5, 150, 105] }, // Vert
        { name: 'Croissance', value: analysis.healthScore.growth, color: [220, 38, 38] }, // Rouge
        { name: 'Position Marché', value: analysis.healthScore.marketPosition, color: [245, 101, 101] } // Orange
      ];

      const total = healthData.reduce((sum, item) => sum + item.value, 0);
      const centerX = margin + contentWidth / 2;
      const centerY = currentY + 40;
      const radius = 35;

      let currentAngle = 0;
      healthData.forEach((item, index) => {
        const sliceAngle = (item.value / total) * 2 * Math.PI;
        
        // Dessiner le segment du graphique circulaire
        pdf.setFillColor(item.color[0], item.color[1], item.color[2]);
        pdf.setDrawColor(255, 255, 255);
        pdf.setLineWidth(1);
        
        // Dessiner l'arc (approximation d'un cercle avec des rectangles)
        const startAngle = currentAngle;
        const endAngle = currentAngle + sliceAngle;
        
        // Calculer les coordonnées du segment
        const x1 = centerX + radius * Math.cos(startAngle);
        const y1 = centerY - radius * Math.sin(startAngle);
        const x2 = centerX + radius * Math.cos(endAngle);
        const y2 = centerY - radius * Math.sin(endAngle);
        
        // Dessiner le segment (approximation simple)
        pdf.line(centerX, centerY, x1, y1);
        pdf.line(centerX, centerY, x2, y2);
        
        // Ajouter le label
        const labelAngle = currentAngle + sliceAngle / 2;
        const labelX = centerX + (radius + 15) * Math.cos(labelAngle);
        const labelY = centerY - (radius + 15) * Math.sin(labelAngle);
        
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(0, 0, 0);
        const percentage = Math.round((item.value / total) * 100);
        pdf.text(`${item.name} ${percentage}%`, labelX - 15, labelY + 3);
        
        currentAngle += sliceAngle;
      });

      // Légende du graphique circulaire
      currentY += 90;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      healthData.forEach((item, index) => {
        const legendX = margin + (index % 2) * 80;
        const legendY = currentY + Math.floor(index / 2) * 8;
        
        pdf.setFillColor(item.color[0], item.color[1], item.color[2]);
        pdf.rect(legendX, legendY, 5, 5, 'F');
        pdf.setTextColor(0, 0, 0);
        pdf.text(item.name, legendX + 8, legendY + 4);
      });

      currentY += 30;

      // Graphique 4: Tendances de Rentabilité (Graphique linéaire)
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Tendances de Rentabilité', margin, currentY);
      currentY += 15;

      const trendData = analysis.charts.profitabilityTrend;
      const trendChartWidth = contentWidth * 0.8;
      const trendChartHeight = 80;
      const trendChartX = margin + (contentWidth - trendChartWidth) / 2;
      const trendChartY = currentY;

      // Dessiner le cadre du graphique
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.5);
      pdf.rect(trendChartX, trendChartY, trendChartWidth, trendChartHeight);

      // Dessiner les lignes de tendance
      const maxTrend = Math.max(...trendData.map(item => Math.max(item.company, item.sector)));
      const minTrend = Math.min(...trendData.map(item => Math.min(item.company, item.sector)));
      const range = maxTrend - minTrend;

      // Dessiner les points et lignes pour l'entreprise (bleu)
      pdf.setDrawColor(37, 99, 235);
      pdf.setLineWidth(2);
      pdf.setFillColor(37, 99, 235);

      trendData.forEach((item, index) => {
        const x = trendChartX + (index / (trendData.length - 1)) * trendChartWidth;
        const y = trendChartY + trendChartHeight - ((item.company - minTrend) / range) * (trendChartHeight - 20) - 10;
        
        // Dessiner le point
        pdf.circle(x, y, 2, 'F');
        
        // Dessiner la ligne vers le point suivant
        if (index < trendData.length - 1) {
          const nextItem = trendData[index + 1];
          const nextX = trendChartX + ((index + 1) / (trendData.length - 1)) * trendChartWidth;
          const nextY = trendChartY + trendChartHeight - ((nextItem.company - minTrend) / range) * (trendChartHeight - 20) - 10;
          pdf.line(x, y, nextX, nextY);
        }
        
        // Label de l'année
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(0, 0, 0);
        pdf.text(item.period, x - 5, trendChartY + trendChartHeight + 5);
      });

      // Dessiner les points et lignes pour le secteur (vert)
      pdf.setDrawColor(5, 150, 105);
      pdf.setLineWidth(2);
      pdf.setFillColor(5, 150, 105);

      trendData.forEach((item, index) => {
        const x = trendChartX + (index / (trendData.length - 1)) * trendChartWidth;
        const y = trendChartY + trendChartHeight - ((item.sector - minTrend) / range) * (trendChartHeight - 20) - 10;
        
        // Dessiner le point
        pdf.circle(x, y, 2, 'F');
        
        // Dessiner la ligne vers le point suivant
        if (index < trendData.length - 1) {
          const nextItem = trendData[index + 1];
          const nextX = trendChartX + ((index + 1) / (trendData.length - 1)) * trendChartWidth;
          const nextY = trendChartY + trendChartHeight - ((nextItem.sector - minTrend) / range) * (trendChartHeight - 20) - 10;
          pdf.line(x, y, nextX, nextY);
        }
      });

      // Légende du graphique de tendances
      currentY += trendChartHeight + 25;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setFillColor(37, 99, 235);
      pdf.rect(margin, currentY, 5, 5, 'F');
      pdf.setTextColor(0, 0, 0);
      pdf.text('Votre entreprise', margin + 10, currentY + 4);
      
      pdf.setFillColor(5, 150, 105);
      pdf.rect(margin + 80, currentY, 5, 5, 'F');
      pdf.text('Secteur', margin + 90, currentY + 4);

      return true;

    } catch (error) {
      console.error('Erreur lors de la génération des graphiques simples:', error);
      return false;
    }
  }



  private async addChartsSection(pdf: jsPDF, analysis: ComparativeAnalysis, startY: number): Promise<void> {
    const margin = 20;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const contentWidth = pageWidth - (margin * 2);
    let currentY = startY;

    // Titre de section
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('GRAPHIQUES ET VISUALISATIONS', margin, currentY);
    currentY += 15;

    // Comparaison des métriques
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Comparaison des Métriques:', margin, currentY);
    currentY += 10;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    analysis.charts.marketPosition.forEach((item, index) => {
      if (currentY > 270) {
        pdf.addPage();
        currentY = margin;
      }
      pdf.text(`• ${item.metric}:`, margin, currentY);
      currentY += 5;
      pdf.text(`  - Votre entreprise: ${item.company}`, margin + 10, currentY);
      currentY += 5;
      pdf.text(`  - Secteur: ${item.sector}`, margin + 10, currentY);
      currentY += 8;
    });

    currentY += 10;

    // Comparaison des revenus
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Comparaison des Revenus:', margin, currentY);
    currentY += 10;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    analysis.charts.revenueComparison.forEach((item, index) => {
      if (currentY > 270) {
        pdf.addPage();
        currentY = margin;
      }
      pdf.text(`• ${item.label}:`, margin, currentY);
      currentY += 5;
      pdf.text(`  - Votre entreprise: ${item.company.toLocaleString()} FCFA`, margin + 10, currentY);
      currentY += 5;
      pdf.text(`  - Secteur: ${item.sector.toLocaleString()} FCFA`, margin + 10, currentY);
      currentY += 8;
    });

    currentY += 10;

    // Tendances de rentabilité
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Tendances de Rentabilité:', margin, currentY);
    currentY += 10;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    analysis.charts.profitabilityTrend.forEach((item, index) => {
      if (currentY > 270) {
        pdf.addPage();
        currentY = margin;
      }
      pdf.text(`• ${item.period}:`, margin, currentY);
      currentY += 5;
      pdf.text(`  - Votre entreprise: ${item.company}%`, margin + 10, currentY);
      currentY += 5;
      pdf.text(`  - Secteur: ${item.sector}%`, margin + 10, currentY);
      currentY += 8;
    });
  }

  private async addSectorTrendsSection(pdf: jsPDF, analysis: ComparativeAnalysis, startY: number): Promise<void> {
    const margin = 20;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const contentWidth = pageWidth - (margin * 2);
    let currentY = startY;

    // Titre de section
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('TENDANCES DU SECTEUR', margin, currentY);
    currentY += 15;

    // Tendances
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Tendances Positives:', margin, currentY);
    currentY += 10;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    analysis.sectorData.trends.forEach((trend, index) => {
      if (currentY > 270) {
        pdf.addPage();
        currentY = margin;
      }
      pdf.text(`• ${trend}`, margin, currentY);
      currentY += 6;
    });

    currentY += 10;

    // Défis
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Défis du Secteur:', margin, currentY);
    currentY += 10;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    analysis.sectorData.challenges.forEach((challenge, index) => {
      if (currentY > 270) {
        pdf.addPage();
        currentY = margin;
      }
      pdf.text(`• ${challenge}`, margin, currentY);
      currentY += 6;
    });

    currentY += 10;

    // Opportunités
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Opportunités:', margin, currentY);
    currentY += 10;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    analysis.sectorData.opportunities.forEach((opportunity, index) => {
      if (currentY > 270) {
        pdf.addPage();
        currentY = margin;
      }
      pdf.text(`• ${opportunity}`, margin, currentY);
      currentY += 6;
    });
  }
}

export default PDFExportService; 
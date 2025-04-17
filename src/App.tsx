exportToPdf: (questions: Question[], title: string): void => {
  try {
    const doc = new jsPDF();
    const margin = 10;
    const pageHeight = doc.internal.pageSize.height;
    const lineHeight = 10;

    const date = new Date().toLocaleDateString();
    const subjectName = "Subject Name: Engineering Mathematics"; // Replace with dynamic value if needed
    const paperTitle = `Question Paper: ${title}`;

    let y = margin;

    const addMetadata = () => {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(paperTitle, margin, y);
      y += lineHeight;

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(subjectName, margin, y);
      y += lineHeight;

      doc.text(`Date: ${date}`, margin, y);
      y += lineHeight + 4;
    };

    const addPageNumber = (pageNum: number) => {
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(10);
      doc.text(`Page ${pageNum} of ${pageCount}`, margin, pageHeight - 5);
    };

    const addSectionHeader = (label: string) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text(label, margin, y);
      y += lineHeight;
      doc.setFont("helvetica", "normal");
    };

    let pageNum = 1;
    addMetadata();
    addPageNumber(pageNum);

    // Group questions by marks
    const sectionAQuestions = questions.filter(q => q.marks === 1);
    const sectionBQuestions = questions.filter(q => q.marks > 1);

    const renderQuestions = (qs: Question[], startIdx: number) => {
      qs.forEach((q, i) => {
        const content = `
${startIdx + i + 1}. (${q.marks} mark${q.marks > 1 ? "s" : ""}) [${q.difficulty}, ${q.bloomLevel}]
Type: ${q.type}
CO: ${q.courseOutcome}, PO: ${q.programOutcome}

${q.content}
        `;

        const splitText = doc.splitTextToSize(content, 180);
        const blockHeight = splitText.length * 6;

        if (y + blockHeight > pageHeight - 20) {
          doc.addPage();
          y = margin;
          pageNum++;
          addMetadata();
          addPageNumber(pageNum);
        }

        doc.text(splitText, margin, y);
        y += blockHeight + 4;
      });

      return startIdx + qs.length;
    };

    // Render Section A
    addSectionHeader("Section A (1-mark Questions)");
    let currentIndex = renderQuestions(sectionAQuestions, 0);

    // Render Section B
    addSectionHeader("Section B (More than 1-mark Questions)");
    renderQuestions(sectionBQuestions, currentIndex);

    doc.save(`${title.replace(/\s+/g, "_")}.pdf`);
    toast.success("PDF exported successfully.");
  } catch (error) {
    console.error("PDF export failed:", error);
    toast.error("Failed to export PDF.");
  }
}

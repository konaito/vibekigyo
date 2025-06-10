export const formUrl=(sections: Record<string, string>): string => {
    // sectionsの型を理解し，md化し，それをURLエンコードしてGoogleフォームのURLに組み込む
    const sectionsMd = Object.entries(sections)
        .map(([key, value]) => `### ${key}\n\n${value}`)
        .join('\n\n');
    console.log('Encoded sections for Google Form:', sectionsMd);
    // GoogleフォームのURLにセクション情報をエンコードして組み込む
    return `https://docs.google.com/forms/d/e/1FAIpQLSc081_tkNGEt_ADTATADJjwPyzKVa83pZCfnWGVnVpkODoaSQ/viewform?usp=pp_url&entry.1409923202=${encodeURIComponent(sectionsMd)}`;
}
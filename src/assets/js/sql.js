const BookTitleList = `SELECT 
                        ContentID, 
                        Title
                      FROM content 
                      WHERE ContentType = 6 AND ___UserId IS NOT NULL AND ___UserId != '' AND ___UserId != 'removed'
                      ORDER BY DateLastRead DESC`;

const BookList = `SELECT
                    IFNULL(Title,'') as 'Book Title', 
                    IFNULL(Subtitle,'') as 'Sub Title', 
                    IFNULL(Attribution,'') as 'Author', 
                    IFNULL(Publisher,'') as 'Publisher', 
                    IFNULL(ISBN,0) as 'ISBN', 
                    IFNULL(date(DateCreated),'') as 'Release Date',
                    IFNULL(Series,'') as 'Series', 
                    IFNULL(SeriesNumber,0) as 'SeriesNumber', 
                    IFNULL(AverageRating,0) as 'Rating', 
                    IFNULL(___PercentRead,0) as 'ReadPercent',
                    IFNULL(CASE WHEN ReadStatus>0 THEN datetime(DateLastRead) END,'') as 'Last Read',
                    IFNULL(___FileSize,0) as 'File Size',
                    IFNULL(CASE WHEN Accessibility=1 THEN 'Store' ELSE CASE WHEN Accessibility=-1 THEN 'Import' ELSE CASE WHEN Accessibility=6 THEN 'Preview' ELSE 'Other' END END END,'') as 'Source'
                  FROM content
                  WHERE ContentType=6 AND ___UserId IS NOT NULL AND ___UserId != '' AND ___UserId != 'removed'
                  ORDER BY Source desc, Title`;

const HighLight = (contentID) => {
  return `SELECT 
            '#' || row_number() over (partition by B.Title order by T.ContentID, T.ChapterProgress), 
            TRIM(REPLACE(REPLACE(T.Text,CHAR(10),''),CHAR(9),''))
          FROM content AS B, bookmark AS T
          WHERE B.ContentID = T.VolumeID AND T.Text != '' AND T.Hidden = 'false' AND B.ContentID = '${contentID}'
          ORDER BY T.ContentID, T.ChapterProgress;`;
};

export { BookTitleList, BookList, HighLight };

const BookListSQL = `SELECT
                    IFNULL(ContentID,'') as 'ContentID',
                    IFNULL(Title,'') as 'BookTitle',
                    IFNULL(Subtitle,'') as 'SubTitle',
                    IFNULL(Attribution,'') as 'Author',
                    IFNULL(Publisher,'') as 'Publisher',
                    IFNULL(ISBN,0) as 'ISBN',
                    IFNULL(date(DateCreated),'') as 'ReleaseDate',
                    IFNULL(Series,'') as 'Series',
                    IFNULL(SeriesNumber,0) as 'SeriesNumber',
                    IFNULL(AverageRating,0) as 'Rating',
                    IFNULL(___PercentRead,0) as 'ReadPercent',
                    IFNULL(CASE WHEN ReadStatus>0 THEN datetime(DateLastRead) END,'') as 'LastRead',
                    IFNULL(___FileSize,0) as 'FileSize',
                    IFNULL(CASE WHEN Accessibility=1 THEN 'Store' ELSE CASE WHEN Accessibility=-1 THEN 'Import' ELSE CASE WHEN Accessibility=6 THEN 'Preview' ELSE 'Other' END END END,'') as 'Source'
                  FROM content
                  WHERE ContentType=6 AND ___UserId IS NOT NULL AND ___UserId != '' AND ___UserId != 'removed'
                  ORDER BY Source desc, Title`;

const HighLightSQL = (contentID) => {
  return `SELECT
            '#' || row_number() over (partition by B.Title order by T.ContentID, T.ChapterProgress),
            TRIM(REPLACE(REPLACE(T.Text,CHAR(10),''),CHAR(9),''))
          FROM content AS B, bookmark AS T
          WHERE B.ContentID = T.VolumeID AND T.Text != '' AND T.Hidden = 'false' AND B.ContentID = '${contentID}'
          ORDER BY T.ContentID, T.ChapterProgress;`;
};

export { BookListSQL, HighLightSQL };

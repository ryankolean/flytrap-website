import type { StructureResolver } from 'sanity/structure';
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list';

export const customStructure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // Singleton: siteSettings
      S.documentTypeListItem('siteSettings')
        .title('Site Settings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Site Settings')
        ),

      S.divider(),

      // Menu system with ordering
      S.listItem()
        .title('Menu Sections')
        .child(
          orderableDocumentListDeskItem({
            type: 'menuSection',
            title: 'Menu Sections',
            S: S,
          })
        ),

      S.documentTypeListItem('menuItem')
        .title('Menu Items'),

      S.divider(),

      // Press & media with ordering
      orderableDocumentListDeskItem({
        type: 'pressEntry',
        title: 'Press Entries',
        S: S,
      }),

      S.divider(),

      // Content with ordering
      orderableDocumentListDeskItem({
        type: 'faqEntry',
        title: 'FAQ Entries',
        S: S,
      }),

      orderableDocumentListDeskItem({
        type: 'dailySpecial',
        title: 'Daily Specials',
        S: S,
      }),

      S.divider(),

      // Gallery with ordering
      orderableDocumentListDeskItem({
        type: 'flyPainting',
        title: 'Fly Paintings',
        S: S,
      }),

      S.divider(),

      // Form captures
      S.documentTypeListItem('intentCaptureSubmission')
        .title('Intent Capture Submissions'),
    ]);

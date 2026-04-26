import type { StructureResolver } from 'sanity/structure';
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list';

export const customStructure: StructureResolver = (S, context) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site Settings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Site Settings'),
        ),

      S.divider(),

      orderableDocumentListDeskItem({
        type: 'menuSection',
        title: 'Menu Sections',
        S,
        context,
      }),

      S.documentTypeListItem('menuItem').title('Menu Items'),

      S.divider(),

      orderableDocumentListDeskItem({
        type: 'pressEntry',
        title: 'Press Entries',
        S,
        context,
      }),

      S.divider(),

      orderableDocumentListDeskItem({
        type: 'faqEntry',
        title: 'FAQ Entries',
        S,
        context,
      }),

      orderableDocumentListDeskItem({
        type: 'dailySpecial',
        title: 'Daily Specials',
        S,
        context,
      }),

      S.divider(),

      orderableDocumentListDeskItem({
        type: 'flyPainting',
        title: 'Fly Paintings',
        S,
        context,
      }),

      S.divider(),

      S.documentTypeListItem('intentCaptureSubmission').title(
        'Intent Capture Submissions',
      ),
    ]);

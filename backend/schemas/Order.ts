import { list } from '@keystone-next/keystone/schema';
import { text, integer, relationship, virtual, timestamp } from '@keystone-next/fields';
import { byTracking, atTracking } from '@keystonejs/list-plugins';
import formatMoney from '../lib/formatMoney';
export const Order = list({
  ui: {
    listView: {
      initialColumns: ['label', 'user', 'charge', 'items'],
    },
  },
  fields: {
    label: virtual({
      label: "Order total",
      graphQLReturnType: 'String',
      resolver(item) {
        return `${formatMoney(item.total)}`;
      },
    }),
    total: integer(),
    items: relationship({ ref: 'OrderItem.order', many: true }),
    user: relationship({ ref: 'User.orders' }),
    charge: text(),
    createdAt: timestamp({
      defaultValue: new Date().toUTCString(),
      ui: {
        itemView: {
          fieldMode: 'read',
        },
        createView: {
          fieldMode: 'hidden'
        },
        listView: {
          fieldMode: 'read'
        }
      },
      access: {
        create: false,
        delete: false,
        read: true,
        update: false
      }
    })
  },
});

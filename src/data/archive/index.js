/**
 * 03 / ARCHIVE 详情入口：以 id 为键集中注册可点击的档案。
 * 新增游戏、图片或资源档案时，在这里追加一条即可被 /archive/:archiveId 找到。
 */
import { evernightArchive } from './evernight'

export const archiveEntries = {
  [evernightArchive.id]: evernightArchive
}

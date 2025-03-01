import { HttpRequest, Controller } from '@/common/types/http'
import { success } from '@/common/utils/response'
import { getUserById } from '@/domains/users/endpoints/user-find/user-find.service'

export const userFindController: Controller = async (req: HttpRequest) => {
  const { id } = req.params
  const user = await getUserById(id)

  return success({
    data: { user },
  })
}

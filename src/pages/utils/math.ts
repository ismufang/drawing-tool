import { create, all } from 'mathjs'

const config = {
  epsilon: 1e-12,
  matrix: 'Matrix',
  number: 'BigNumber',
  precision: 64,
  predictable: false,
}

const math = create(all, config)

export default math

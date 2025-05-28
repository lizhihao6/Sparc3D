# Sparc3D  
**Sparse Representation and Construction for High-Resolution 3D Shapes Modeling**

[![Homepage](https://img.shields.io/badge/Homepage-Website-blue)](https://lizhihao6.github.io/Sparc3D/) [![ArXiv](https://img.shields.io/badge/arXiv-2505.14521-red)](https://arxiv.org/abs/2505.14521) [![Demo (Coming Soon)](https://img.shields.io/badge/Demo%20(Coming%20Soon)-HuggingFace-orange?logo=huggingface)](#)

## Abstract

<div align="center">
  <img src="assets/images/teaser.png" alt="Sparc3D Teaser" width="600" />
</div>

> High-fidelity 3D object synthesis remains significantly more challenging than 2D image generation due to the unstructured nature of mesh data and the cubic complexity of dense volumetric grids. Existing two-stage pipelines—compressing meshes with a VAE (using either 2D or 3D supervision), followed by latent diffusion sampling—often suffer from severe detail loss caused by inefficient representations and modality mismatches introduced in VAE.  
>  
> We introduce **Sparc3D**, a unified framework that combines a sparse deformable marching cubes representation **Sparcubes** with a novel encoder **Sparconv-VAE**. Sparcubes converts raw meshes into high-resolution (1024³) surfaces with arbitrary topology by scattering signed distance and deformation fields onto a sparse cube, allowing differentiable optimization. Sparconv-VAE is the first modality-consistent variational autoencoder built entirely upon sparse convolutional networks, enabling efficient and near-lossless 3D reconstruction suitable for high-resolution generative modeling through latent diffusion.  
>  
> Sparc3D achieves state-of-the-art reconstruction fidelity on challenging inputs, including open surfaces, disconnected components, and intricate geometry. It preserves fine-grained shape details, reduces training and inference cost, and integrates naturally with latent diffusion models for scalable, high-resolution 3D generation.


## Citation

If you find this work useful, please cite:

```bibtex
@article{li2025sparc3d,
  title   = {Sparc3D: Sparse Representation and Construction for High-Resolution 3D Shapes Modeling},
  author  = {Li, Zhihao and Wang, Yufei and Zheng, Heliang and Luo, Yihao and Wen, Bihan},
  journal = {arXiv preprint arXiv:2505.14521},
  year    = {2025}
}